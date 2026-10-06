const files = [
  'src/api/client.ts',
  'src/api/session.ts',
  'src/commands/logout.js',
  'src/commands/login.js',
  'src/utils/parser.ts',
  'src/auth/token.ts',
  'src/db/query.ts',
  'src/server/routes.ts',
  'src/ui/table.tsx',
  'src/config/loader.js',
]

const titles = [
  'Change this code to not construct SQL queries directly from user input.',
  'Make sure this permissive CORS policy is safe here.',
  'Remove this unused local variable.',
  'Refactor this function to reduce its cognitive complexity.',
  'Replace this hard-coded credential with a secret reference.',
  'Make sure this regex is safe against ReDoS attacks.',
  'Add a test case covering this branch.',
  'This condition will always evaluate to true.',
  'Use a cryptographically strong random number generator here.',
  'Handle the possible null return value.',
]

const severities = ['Blocker', 'High', 'Medium', 'Low', 'Info']
const severityWeights = [12, 22, 34, 28, 20] // out of 116 -> ~116 issues

const qualities = ['Security', 'Reliability', 'Maintainability']
const types = ['Vulnerability', 'Bug', 'Code Smell', 'Security Hotspot']
const statuses = ['Open', 'Confirmed', 'Open', 'Open', 'Accepted']
const efforts = ['5min effort', '10min effort', '15min effort', '25min effort', '30min effort', '1h effort', '2h effort']
const timesAgo = ['today', 'yesterday', '2 days ago', '5 days ago', '1 week ago', '2 weeks ago', '3 weeks ago', '6 weeks ago', '2 months ago']

const pick = (arr, i) => arr[i % arr.length]

export const issues = []
let id = 0
severities.forEach((severity, s) => {
  for (let n = 0; n < severityWeights[s]; n += 1) {
    const i = id
    issues.push({
      id: String(id + 1),
      file: pick(files, i),
      title: pick(titles, i * 3 + s),
      security: i % 2 === 0,
      severity,
      quality: pick(qualities, i + s),
      status: pick(statuses, i),
      assignee: i % 5 === 0 ? 'Maya Chen' : 'Not assigned',
      line: `L${(i * 37) % 400 + 7}`,
      comments: i % 4 === 0 ? (i % 3) + 1 : 0,
      effort: pick(efforts, i),
      timeAgo: pick(timesAgo, i * 2 + s),
      createdRank: i, // lower = older, used for "Creation date" sort
      type: pick(types, i + s),
      tags: i % 2 === 0 ? ['cwe', 'owasp'] : i % 3 === 0 ? ['cwe'] : [],
      responsibility: 'Responsibility',
    })
    id += 1
  }
})
