FROM postgres:15

RUN apt-get update && apt-get install -y gettext-base && rm -rf /var/lib/apt/lists/*

#COPY ./scripts/init.template.sql /docker-entrypoint-initdb.d/init.template.sql
#COPY scripts/init.template.sql /docker-entrypoint-initdb.d/init.template.sql