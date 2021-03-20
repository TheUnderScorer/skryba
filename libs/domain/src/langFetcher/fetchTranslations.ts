import { Browser, Page } from 'puppeteer';
import { FetchTranslationsResult } from '@pable/domain-types';
import { URL } from 'url';
import { FetchTranslationsDto } from '@pable/shared';
import { buildTranslationUrl } from './buildTranslationUrl';
import { getElementPropertyAsText } from '@pable/shared-server';

interface FetchTranslationsDependencies {
  browser: Browser;
  deeplUrl: URL;
}

const selectors = {
  targetTextArea: '.lmt__target_textarea',
  sourceTextArea: '.lmt__source_textarea',
};

const waitForTranslationResult = async (page: Page) => {
  await page.waitForFunction(
    (deeplSelectors: typeof selectors) => {
      const textArea = document.querySelector<HTMLTextAreaElement>(
        deeplSelectors.targetTextArea
      );

      return Boolean(textArea.value);
    },
    {
      timeout: 60_000,
      polling: 500,
    },
    selectors
  );
};

export const makeFetchTranslations = ({
  browser,
  deeplUrl,
}: FetchTranslationsDependencies) => async (
  dto: FetchTranslationsDto
): Promise<FetchTranslationsResult> => {
  const context = await browser.createIncognitoBrowserContext();

  try {
    const url = buildTranslationUrl(deeplUrl, dto);
    const page = await context.newPage();

    await page.goto(url.toString());

    await waitForTranslationResult(page);

    const targetTextArea = await page.$(selectors.targetTextArea);

    const translation = await getElementPropertyAsText<string | null>(
      targetTextArea,
      'value'
    );

    if (!translation) {
      throw new Error(`No translation found for word ${dto.word}`);
    }

    return {
      translation,
    };
  } finally {
    await context.close();
  }
};

export type FetchTranslations = ReturnType<typeof makeFetchTranslations>;
