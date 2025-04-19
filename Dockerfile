### Build stage
FROM maven:3.6-openjdk-17 as builder
WORKDIR /tmp/build-dir
COPY . .
RUN cd /tmp/build-dir && mvn clean package -DskipTests

### Production stage
FROM openjdk:17.0.1-jdk-slim
LABEL maintainer="Oliver Hoogvliet < Raimar Falke <raimar.falke@codecentric.de>"
RUN groupadd -r app && useradd --no-log-init -r -g app app
WORKDIR /home/app
COPY --from=builder /tmp/build-dir/container_start.sh /app/container_start.sh
RUN chmod 755 /app/container_start.sh

### Copy AWS Credentials passed as arguments
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
RUN mkdir -p /home/app/.aws && \
    echo "[default]" > /home/app/.aws/credentials && \
    echo "aws_access_key_id = $AWS_ACCESS_KEY_ID" >> /home/app/.aws/credentials && \
    echo "aws_secret_access_key = $AWS_SECRET_ACCESS_KEY" >> /home/app/.aws/credentials && \
    echo "[default]" > /home/app/.aws/config && \
    echo "region = us-east-1" >> /home/app/.aws/config && \
    echo "output = json" >> /home/app/.aws/config

USER app
ENTRYPOINT ["/app/container_start.sh"]
EXPOSE 8080
COPY --from=builder /tmp/build-dir/target/app.jar /app/app.jar
