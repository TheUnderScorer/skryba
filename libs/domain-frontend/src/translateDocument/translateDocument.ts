import {
  isTranslatedDocumentEntry,
  TranslatedDocumentEntries,
  TranslatedDocumentEntry,
  TranslationEntry,
} from '@skryba/domain-types';
import { map, pipe, reduce } from 'remeda';

interface TranslateDocumentParams {
  content: string;
  translations: TranslationEntry[];
}

const forbiddenChars = ['"', '[', ']', '{', '}'];

const separator = '<sep>';

export const translateDocument = ({
  content,
  translations,
}: TranslateDocumentParams): TranslatedDocumentEntries => {
  const nbspRegex = new RegExp(String.fromCharCode(160), 'g');
  const formattedContent = content.replace(nbspRegex, ' ');

  return pipe(
    translations,
    reduce((currentResult, translation) => {
      if (!translation.sourceWord) {
        return currentResult;
      }

      const regex = new RegExp(
        `(?<!\\w)${translation.sourceWord}(?!\\w)`,
        'gi'
      );

      return currentResult.replace(regex, (match, index) => {
        if (
          forbiddenChars.includes(currentResult[index - 1]) ||
          forbiddenChars.includes(currentResult[index + 1])
        ) {
          return match;
        }

        const formattedMatch = match.replace(/\n/g, '');

        const json = {
          translation,
          arrayIndex: 0,
          word: formattedMatch,
          key: `${formattedMatch}-${index}`,
        } as TranslatedDocumentEntry;

        return `${separator}${JSON.stringify(json)}${separator}`;
      });
    }, formattedContent),
    (val) => val.split(separator),
    map.indexed<string, TranslatedDocumentEntry | string>((item, index) => {
      try {
        const parsed = JSON.parse(item);

        if (isTranslatedDocumentEntry(parsed)) {
          return {
            ...parsed,
            translation: parsed.translation,
            arrayIndex: index,
          };
        }

        return item;
      } catch {
        return item;
      }
    })
  );
};
