#! /usr/bin/env zsh

echo 'CLEANING STARTED'

# Remove directories out, dep and all *.log files
rm -rvf out
rm -rvf dep
rm -vf **/*.log

# Remove all empty directories
rm -vd **/*(/^F)

echo 'CLEANING COMPLETED'
