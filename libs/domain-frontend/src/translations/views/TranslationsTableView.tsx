import { Box, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { TranslationsConfiguration } from '../components/TranslationsConfiguration/TranslationsConfiguration';
import { TranslationsTable } from '../components/TranslationsTable/TranslationsTable';
import { FormProvider } from 'react-hook-form';
import {
  initialTranslationEntry,
  TranslationsForm,
} from '@skryba/domain-types';
import { useLocalStorageForm } from '@skryba/shared-frontend';
import { TranslationsErrorBoundary } from '../components/TranslationsErrorBoundary/TranslationsErrorBoundary';

export const TranslationsTableView = () => {
  const form = useLocalStorageForm<TranslationsForm>({
    defaultValues: {
      entries: [
        {
          ...initialTranslationEntry,
        },
      ],
      newEntry: {},
    },
    localStorageKey: 'translationsForm',
    shouldUnregister: false,
  });

  return (
    <FormProvider {...form}>
      <Text id="title" textAlign="center" fontSize="6xl" mb={6}>
        Skryba 2.0{' '}
        <span role="img" aria-label="Hand write">
          ✍️
        </span>
      </Text>
      <TranslationsErrorBoundary
        clearEntries={() => {
          form.setValue('entries', [
            {
              ...initialTranslationEntry,
            },
          ]);

          window.location.reload();
        }}
      >
        <Box as="form" onSubmit={form.handleSubmit(console.log)}>
          <Stack>
            <TranslationsConfiguration />
            <TranslationsTable />
          </Stack>
        </Box>
      </TranslationsErrorBoundary>
    </FormProvider>
  );
};