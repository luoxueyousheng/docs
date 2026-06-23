#!/usr/bin/env python3
"""
Webhook 服务器（FastAPI）——部署在你自己的服务器上。
接收 GitHub Actions 的部署通知（POST /webhook/deploy，校验 X-Webhook-Token），
然后：docker login → 拉取最新镜像 → 停掉并重建站点容器。

配置全部来自环境变量（见 deploy/docker-compose.yml + deploy/.env）。
"""

import os
import sys
import hmac
import logging
import traceback
from contextlib import asynccontextmanager

import docker
from fastapi import FastAPI, Request, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import uvicorn

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)
sys.stdout.reconfigure(line_buffering=True)

WEBHOOK_TOKEN = os.environ.get('WEBHOOK_TOKEN', '')
DOCKERHUB_USER = os.environ.get('DOCKERHUB_USER', '')
DOCKERHUB_TOKEN = os.environ.get('DOCKERHUB_TOKEN', '')
IMAGE_NAME = os.environ.get('IMAGE_NAME', 'yiminger/jadeview_docs:latest')
CONTAINER_NAME = os.environ.get('CONTAINER_NAME', 'docs-site')
# 站点对外端口：重建容器时映射 host:SITE_PORT -> container:80。
# 必须与 docker-compose.yml 里 docs 服务端口、以及反代指向端口一致；默认 8088。
SITE_PORT = int(os.environ.get('SITE_PORT', '8088'))

ALLOWED_PATHS = {'/webhook/deploy', '/health'}


class SecurityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        method = request.method
        if path not in ALLOWED_PATHS:
            logger.warning(f"拦截非法请求: {method} {path} from {request.client.host}")
            return JSONResponse(status_code=404, content={'error': 'Not Found'})
        if path == '/webhook/deploy' and method != 'POST':
            return JSONResponse(status_code=405, content={'error': 'Method Not Allowed'})
        if path == '/health' and method != 'GET':
            return JSONResponse(status_code=405, content={'error': 'Method Not Allowed'})
        return await call_next(request)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=" * 50)
    logger.info("Webhook 服务器启动 (FastAPI)")
    logger.info(f"镜像: {IMAGE_NAME}")
    logger.info(f"容器: {CONTAINER_NAME}  端口: {SITE_PORT} -> 80")
    logger.info(f"Docker Hub 用户: {DOCKERHUB_USER or '未配置'}")
    logger.info("端点: POST /webhook/deploy")
    logger.info("=" * 50)
    yield
    logger.info("Webhook 服务器关闭")


app = FastAPI(title="Webhook Server", docs_url=None, redoc_url=None, openapi_url=None, lifespan=lifespan)
app.add_middleware(SecurityMiddleware)


def verify_token(token: str) -> bool:
    if not token or not WEBHOOK_TOKEN:
        return False
    return hmac.compare_digest(token, WEBHOOK_TOKEN)


def do_deploy(data: dict):
    logger.info("=" * 50)
    logger.info(f"开始部署: {data.get('repository', 'unknown')}")
    commit = data.get('commit', '')
    logger.info(f"Commit: {commit[:8] if commit else 'unknown'}")
    logger.info("=" * 50)

    try:
        client = docker.from_env()

        if DOCKERHUB_USER and DOCKERHUB_TOKEN:
            logger.info(f"登录 Docker Hub: {DOCKERHUB_USER}")
            try:
                client.login(username=DOCKERHUB_USER, password=DOCKERHUB_TOKEN)
                logger.info("登录成功")
            except Exception as e:
                logger.warning(f"登录失败（继续尝试拉取公开镜像）: {e}")

        logger.info(f"拉取镜像: {IMAGE_NAME}")
        client.images.pull(IMAGE_NAME)
        logger.info("镜像拉取成功")

        try:
            old = client.containers.get(CONTAINER_NAME)
            logger.info(f"停止旧容器: {CONTAINER_NAME}")
            old.stop(timeout=30)
            old.remove()
            logger.info("旧容器已移除")
        except docker.errors.NotFound:
            logger.info("旧容器不存在，跳过")
        except Exception as e:
            logger.error(f"移除旧容器出错: {e}")
            try:
                old.remove(force=True)
            except Exception:
                pass

        logger.info(f"启动新容器: {CONTAINER_NAME}  (host {SITE_PORT} -> container 80)")
        container = client.containers.run(
            IMAGE_NAME,
            name=CONTAINER_NAME,
            detach=True,
            restart_policy={'Name': 'unless-stopped'},
            ports={'80/tcp': SITE_PORT},
        )
        logger.info(f"新容器已启动: {container.id[:12]}")

        try:
            client.images.prune()
            logger.info("无用镜像已清理")
        except Exception:
            pass

        logger.info("部署成功!")
    except Exception as e:
        logger.error(f"部署失败: {e}")
        logger.error(traceback.format_exc())


@app.post("/webhook/deploy")
async def deploy(request: Request, background_tasks: BackgroundTasks):
    token = request.headers.get('X-Webhook-Token', '')
    if not verify_token(token):
        logger.warning(f"Token 验证失败: {request.client.host}")
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        data = await request.json()
    except Exception:
        data = {}
    logger.info(f"收到部署请求: {data.get('repository', 'unknown')} from {request.client.host}")
    background_tasks.add_task(do_deploy, data)
    return JSONResponse(status_code=202, content={'status': 'accepted', 'message': '部署请求已接收'})


@app.get("/health")
async def health():
    return {'status': 'ok'}


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=9000, log_level='info')
