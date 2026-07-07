export interface SectionIntro {
  paragraphs: string[];
}

export const SECTION_INTROS: Record<string, SectionIntro> = {
  "everyday-living": {
    paragraphs: [
      "Managing your finances can be complicated. This journey takes you through step by step at the big things you should be thinking about. We start at here at everyday living.",
      "Everyday living covers the regular costs of running your household. Things like rent or mortgage, bills, food, and day-to-day spending.",
      "In this section we'll try to see if you're day to day costs are covered. If they are, great! If not, we'll help you think about how to make some adjustments.",
      
    ],
  },
  "emergency-funds": {
    paragraphs: [
      "Next is emergency funds. This is money set aside for unexpected costs. Things like a broken phone, a period without work, or an urgent repair.",
      "Ideally, this will equal about 1 month's worth of your income.",
      "Why do this before thinking about debt? This fund is designed to cover you in very sudden needs. Without it, you're likely to end up in debt. Paying off debt is important, but not as important as having that initial safety net.",
      "Why only one month? We want to start removing debt as quickly as possible. If you have a month's worth of income saved, you can start paying off debt without having that worry of not being able to pay for something in an emergency.",
    ],
  },
  debt: {
    paragraphs: [
      "Next up is debt. This is money you owe to others. Things like credit card debt, a car loan, or a personal loan.",
      "Debt isn't always a bad thing. A mortgage or student loan can be part of a normal financial picture. What matters is whether repayments are manageable.",
      "Having said that, a lot of debt is generally bad and should be reduced or avoided as soon as possible.",
      "We specifically have not included mortgages in this journey. This is because they are 'secured' debt and this section is more focused on unsecured debt like those listed above. If you want to know more about the differences between secured and unsecured debt, you can read more in our FAQs page at the end of this section.",
    ],
  },
  "easy-access-savings": {
    paragraphs: [
      "Next up is easy access savings. This is money you can get to quickly, without penalties. Useful for short-term goals like trips or a new laptop, or for larger emergency expenses like boiler or car repairs.",
      "Here we'll look at how much you could save and what goals you would like to save for.",
      "Don't include life purchases in this section such as a house, a new car, or a wedding. We'll cover those in the next section.",
      "We'll also explain what the difference between a savings account and an ISA is, and how to choose the right one for you.",
    ],
  },
  "life-purchases": {
    paragraphs: [
      "Next up is life purchases.",
      "Life purchases are the bigger things you should be planing for. Things likea house, a new car, a wedding, or helping with education costs.",
      "Here we'll look at how to save for these bigger purchases. We'll also ask here about whether you live and are a UK resident. This may seem odd but there are specific schemes only available to UK residents such as the Help to Buy Scheme and Lifetime ISAs (LISAs).",
    ],
  },
  "long-term-investments": {
    paragraphs: [
      "Finally, we'll look at long-term investments.",
      "This is the final step in your financial journey until you reach retirement. Here we'll look at what you already have in place for the future and whether you're on track for your longer-term goals.",
      "This mainly fits into two sections: pensions and investments.",
      "We have already asked you about pensions in the everyday living section with your workplace. If you're self-employed, we'll ask you about this here.",
      "Investments are the next step after pensions. Here we'll look at longer term growth and look at the different types of investments you could consider.",
    ],
  },
};

export function getSectionIntro(slug: string): SectionIntro | undefined {
  return SECTION_INTROS[slug];
}
