#!/bin/bash

function newaoc() {
  if [ $# -lt 1 ]; then
    echo "Usage: newaoc <daynum>"
    return 1
  fi

  daynum="$1"
  year=$(date +%Y)
  root=$(git rev-parse --show-toplevel)

  mkdir -p $root/data/$year
  datafile=$root/data/$year/${daynum}_input.txt
  touch $datafile

 
  mkdir -p $root/src/solutions/$year/
  codefile=$root/src/solutions/$year/$daynum.ts

  # write this in the .ts file:
  cat <<EOF > $codefile
import { readInput } from '../../helpers/readFile';

export async function solution_${year}_${daynum}_1() {
  const input = await readInput('../data/${year}/${daynum}_input.txt');
  return -1;
};

export async function solution_${year}_${daynum}_2() {
  const input = await readInput('../data/${year}/${daynum}_input.txt');
  return -1;
};
EOF

  mkdir -p $root/test/$year/
  specfile=$root/test/$year/$daynum.spec.ts

  # write this in the .spec.ts file:
  cat <<EOF > $specfile
import { it, describe, expect } from 'vitest';

describe('day $daynum $year', () => {
  it('', () => {});
});

EOF

  echo "Created files for Advent of Code $year Day $daynum"

  code $codefile
  code $specfile
  code $datafile
}

newaoc $1