FROM wernight/phantomjs

USER root

RUN apt-get update; \
    apt-get install -y --no-install-recommends curl; \
    curl -sL https://deb.nodesource.com/setup_5.x | bash - ;\
    apt-get install -y nodejs; \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
