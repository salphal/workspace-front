########################
# 1. 基础镜像( Node 环境 )
########################
FROM node:18-alpine AS base

# 安装兼容性库，防止某些原生依赖报错
RUN apk add --no-cache libc6-compat

WORKDIR /app


###################################
# 2. 安装依赖阶段( 使用 pnpm 安装 )
###################################
FROM base AS deps

# 安装 pnpm
RUN npm install -g pnpm

# 设置国内镜像源( 可选，加快安装速度 )
RUN pnpm config set registry https://registry.npmmirror.com/

# 拷贝依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install


##########################
# 3. 构建阶段( 打包产物 )
##########################
FROM base AS builder

# 安装 git，方便使用 git 依赖( 如有 )
RUN apk update && apk add --no-cache git

WORKDIR /app

# 拷贝依赖( node_modules )和源代码
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 执行构建命令( 产物默认输出至 /app/dist )
RUN npm run build


####################################
# 4. 运行阶段( 使用 nginx 提供静态服务 )
####################################
FROM nginx:alpine AS runner

# 设置工作目录为 nginx 静态资源目录
WORKDIR /usr/share/nginx/html

# 拷贝构建好的前端文件到 nginx
COPY --from=builder /app/dist .

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
