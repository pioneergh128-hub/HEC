export interface ConsolidatedISPeriod {
  period: string
  revenue: number
  naverPlatform: number
  ad: number
  service: number
  financialPlatform: number
  globalChallenge: number
  c2c: number
  content: number
  enterprise: number
  opExpense: number
  devOps: number
  headcount: number
  other: number
  partner: number
  infra: number
  marketing: number
  opIncome: number
  opMargin: number
  netIncome: number
  netMargin: number
  fcf: number
}

export interface ConsolidatedBSPeriod {
  period: string
  currentAssets: number
  cash: number
  receivables: number
  otherCurrent: number
  nonCurrentAssets: number
  investments: number
  ppe: number
  rightOfUse: number
  intangibles: number
  otherNonCurrent: number
  totalAssets: number
  currentLiabilities: number
  nonCurrentLiabilities: number
  totalLiabilities: number
  controllingInterest: number
}

export interface StandaloneISPeriod {
  period: string
  revenue: number
  opExpense: number
  opIncome: number
  opMargin: number
  netIncome: number
  netMargin: number
  otherIncome: number
  otherExpense: number
  ebt: number
  taxExpense: number
  comprehensiveIncome: number
}

export interface StandaloneBSPeriod {
  period: string
  currentAssets: number
  cash: number
  receivables: number
  other: number
  nonCurrentAssets: number
  investments: number
  ppe: number
  rightOfUse: number
  intangibles: number
  totalAssets: number
  currentLiabilities: number
  nonCurrentLiabilities: number
  totalLiabilities: number
}

export interface YoYQoQ {
  yoy: number | null
  qoq: number | null
}
