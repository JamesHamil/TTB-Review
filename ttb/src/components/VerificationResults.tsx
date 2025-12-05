// Verification Results Component

import type { VerificationResult } from '../types';

interface VerificationResultsProps {
  result: VerificationResult;
}

export function VerificationResults({ result }: VerificationResultsProps) {
  return (
    <section className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className={`${result.success ? 'border-4 border-green-500' : 'border-4 border-red-500'}`}>
        {/* Header */}
        <div className={`${result.success ? 'bg-green-600' : 'bg-red-600'} text-white p-6`}>
          <h2 className="text-2xl font-bold mb-2">
            {result.success ? '✓ Verification Passed' : '✗ Verification Failed'}
          </h2>
          <p className="text-white/95">
            {result.success
              ? 'The label matches the form data. All required information is consistent.'
              : 'The label does not match the form data. Please review the discrepancies below.'}
          </p>
        </div>

        {/* Verification Details */}
        <div className="p-6 bg-white">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Verification Details:</h3>
          <ul className="space-y-2">
            {result.details.map((detail, index) => (
              <li
                key={index}
                className={`p-3 rounded-lg font-medium border-l-4 ${
                  detail.startsWith('✓')
                    ? 'bg-green-50 text-green-800 border-green-500'
                    : detail.startsWith('✗')
                    ? 'bg-red-50 text-red-800 border-red-500'
                    : 'bg-orange-50 text-orange-700 border-orange-500'
                }`}
              >
                {detail}
              </li>
            ))}
          </ul>

          {/* Compliance Issues */}
          {result.complianceIssues && result.complianceIssues.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">⚠️ Compliance Issues:</h3>
              <ul className="space-y-2">
                {result.complianceIssues.map((issue, index) => (
                  <li
                    key={index}
                    className={`p-3 rounded-lg font-medium border-l-4 ${
                      issue.severity === 'high'
                        ? 'bg-red-50 text-red-800 border-red-500'
                        : issue.severity === 'medium'
                        ? 'bg-orange-50 text-orange-700 border-orange-500'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start">
                      <span className="font-bold mr-2">
                        {issue.severity === 'high' ? '🚫' : issue.severity === 'medium' ? '⚠️' : 'ℹ️'}
                      </span>
                      <span>{issue.message}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Extracted Text */}
        <details className="mx-6 mb-6 bg-gray-50 rounded-lg border border-gray-200">
          <summary className="cursor-pointer font-semibold text-gray-700 p-4 hover:text-blue-600 transition select-none">
            View Extracted Text from Label
          </summary>
          <pre className="mt-2 mx-4 mb-4 p-4 bg-white border border-gray-300 rounded overflow-x-auto text-sm text-gray-700 whitespace-pre-wrap break-words">
            {result.extractedText}
          </pre>
        </details>
      </div>
    </section>
  );
}

