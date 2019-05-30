FROM openjdk:8

# Create darties directory
WORKDIR /usr/src/darties_talend

COPY ./lib ./lib
COPY ./MAIN ./MAIN

CMD [ "/bin/bash", "/usr/src/darties_talend/MAIN/MAIN_run.sh" ]