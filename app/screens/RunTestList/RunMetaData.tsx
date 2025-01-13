import {Card, CardContent, CardHeader} from '~/ui/card'
import React from 'react'
import {Skeleton} from '@ui/skeleton'

const TEST_STATUS_TO_DISPLAY = [
  'passed',
  'failed',
  'total',
  'untested',
  'retest',
]

export const TEST_STATUS_TEXT_COLOR_MAPPING: {[key: string]: string} = {
  passed: 'text-green-600',
  failed: 'text-red-600',
  retest: 'text-yellow-500',
}

export const RunMetaData = ({testRunsMetaData}: {testRunsMetaData: any}) => {
  if (!testRunsMetaData) {
    return (
      <div className="flex gap-6">
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="h-24 flex flex-col min-w-32 bg-gray-50 p-2 rounded-md shadow-md">
              <Skeleton className="h-4 w-1/3 mb-2 rounded" />
              <Skeleton className="h-8 w-1/2 rounded" />
            </div>
          ))}
      </div>
    )
  }

  return (
    <div className={'flex gap-6'}>
      {Object.keys(testRunsMetaData).map((key, index) => {
        if (TEST_STATUS_TO_DISPLAY.includes(key)) {
          const percentageValue =
            testRunsMetaData['total'] === 0
              ? 0
              : Number(
                  (
                    (testRunsMetaData[key] * 100) /
                    testRunsMetaData['total']
                  ).toFixed(2),
                )

          return (
            <Card key={index} className={'h-24 flex flex-col min-w-32'}>
              <CardHeader
                className={`text-base text-slate-400 capitalize ${TEST_STATUS_TEXT_COLOR_MAPPING[key]}`}>
                {key}
              </CardHeader>
              <CardContent>
                <span
                  className={`text-2xl font-normal ${
                    testRunsMetaData[key] > 0 &&
                    TEST_STATUS_TEXT_COLOR_MAPPING[key]
                  }`}>
                  {testRunsMetaData[key]}
                </span>
                {key !== 'total' && (
                  <span className={'text text-gray-500'}>
                    {` (${percentageValue}%)`}
                  </span>
                )}
              </CardContent>
            </Card>
          )
        }
      })}
    </div>
  )
}
