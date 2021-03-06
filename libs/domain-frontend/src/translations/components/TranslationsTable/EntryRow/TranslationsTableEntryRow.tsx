import React, {
  KeyboardEventHandler,
  memo,
  useCallback,
  useState,
} from 'react';
import {
  TranslationsTableRow,
  TranslationsTableRowProps,
} from '../Row/TranslationsTableRow';
import { Key } from 'ts-key-enum';
import { useDebounce } from 'react-use';

export interface TranslationsTableEntryRowProps
  extends Pick<TranslationsTableRowProps, 'onRemove' | 'entry' | 'setValue'> {
  index: number;
  isLast: boolean;
  onAdd: () => void;
  itemsCount: number;
}

export const TranslationsTableEntryRow = memo(
  ({
    index,
    onRemove,
    entry,
    onAdd,
    isLast,
    itemsCount,
    ...props
  }: TranslationsTableEntryRowProps) => {
    const [didAdd, setDidAdd] = useState(false);

    const handleAdd = useCallback(
      (): KeyboardEventHandler => (event) => {
        if (event.key !== Key.Enter || !isLast || event.shiftKey) {
          return;
        }

        event.preventDefault();

        onAdd();

        setDidAdd(true);
      },
      [isLast, onAdd]
    );

    useDebounce(
      () => {
        if (didAdd) {
          document
            .querySelector<HTMLInputElement>('.last-entry .sourceWord')
            ?.focus();

          setDidAdd(false);
        }
      },
      25,
      [didAdd]
    );

    return (
      <TranslationsTableRow
        className={isLast ? 'last-entry' : ''}
        entry={entry}
        onRemove={itemsCount <= 1 ? undefined : onRemove}
        inputVariant="filled"
        index={index}
        alternativesName={`entries.${index}.alternatives` as const}
        sourceWordName={`entries.${index}.sourceWord` as const}
        targetWordName={`entries.${index}.targetWord` as const}
        targetWordEditedManuallyName={
          `entries.${index}.targetWordEditedManually` as const
        }
        onKeyDown={handleAdd}
        {...props}
      />
    );
  }
);
