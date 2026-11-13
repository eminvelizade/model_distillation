#!/bin/bash
# perf.sh <material>: how long one frame takes (68 px on a 2x screen), next to plush, with a look's own program and
# with the shared one. On the software renderer the tests use: good for comparing, not as a real figure.
M=${1:?material}; H="$(cd "$(dirname "$0")" && pwd)"
L="[{\"shape\":\"pom\",\"colour\":\"sky\",\"eyes\":\"bean\",\"glasses\":\"none\",\"extra\":\"none\"},{\"shape\":\"pom\",\"material\":\"$M\",\"colour\":\"sky\",\"eyes\":\"bean\",\"glasses\":\"none\",\"extra\":\"none\"},{\"shape\":\"cub\",\"material\":\"$M\",\"colour\":\"coral\",\"accent\":\"teal\",\"eyes\":\"bead\",\"glasses\":\"round\",\"extra\":\"scarf\"}]"
cd "$H" && echo "own program (plush pom, $M pom, $M cub with scarf and glasses):" && timeout 280 node perf.cjs "" 68 2 "$L" "own=1" 2>&1 | tail -1 && echo "shared program:" && timeout 280 node perf.cjs "" 68 2 "$L" 2>&1 | tail -1
