#!/bin/bash

arch="$(uname -m)"; 
case "$arch" in 
    arm64) export AMAZON_ARCH_FLAG='aarch64' ;; 
    x86_64) export AMAZON_ARCH_FLAG='x64' ;; 
esac;
echo $AMAZON_ARCH_FLAG