#!/bin/bash

CMD="cat $1 "
for process in "${@:2}"; do
    CMD="$CMD| node $process "
done

eval "$CMD"