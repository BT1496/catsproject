#!/bin/bash
# create multiresolution windows icon
ICON_SRC=../../src/qt/res/icons/catstcoin.png
ICON_DST=../../src/qt/res/icons/catscoin.ico
convert ${ICON_SRC} -resize 16x16 catscoin-16.png
convert ${ICON_SRC} -resize 32x32 catscoin-32.png
convert ${ICON_SRC} -resize 48x48 catscoin-48.png
convert catscoin-16.png catscoin-32.png catscoin-48.png ${ICON_DST}

