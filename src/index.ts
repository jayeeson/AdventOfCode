const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: yarn start <day> [year]');
  console.log('Example: yarn start 3           # runs day 3 for current year');
  console.log('Example: yarn start 3 2025      # runs day 3 for 2025');
  console.log(
    'Example: yarn start 3 2025 1    # runs day 3 for 2025, part 1 only'
  );
  process.exit(1);
}

const currentYear = new Date().getFullYear().toString();
const day = args[0];
const year = args[1] ?? currentYear;

(async () => {
  try {
    const module = await import(`./solutions/${year}/${day}`);
    const part1 = `solution_${year}_${day}_1`;
    const part2 = `solution_${year}_${day}_2`;

    if (module[part1]) {
      console.log(`solution${day}_1: `, await module[part1]());
    }
    if (module[part2]) {
      console.log(`solution${day}_2: `, await module[part2]());
    }
  } catch (error) {
    console.error(`Error loading solution for ${year}/${day}:`, error);
    process.exit(1);
  }
})();
