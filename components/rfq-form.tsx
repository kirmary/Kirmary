'use client';

import {
  useState,
  type ChangeEvent
} from 'react';

type FormData = Record<string, string>;

export function RfqForm() {
  const [step, setStep] = useState(1);

  const [data, setData] = useState<FormData>({});

  const [result, setResult] = useState('');

  const [sending, setSending] = useState(false);

  const [successReference, setSuccessReference] = useState('');


  /* ==================================================
     UPDATE FIELDS
  ================================================== */

  const update = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData(current => ({
      ...current,
      [e.target.name]: e.target.value
    }));

    setResult('');
  };


  /* ==================================================
     NEXT STEP
  ================================================== */

  function nextStep() {
    if (step === 1) {
      if (
        !data.fullName?.trim() ||
        !data.workEmail?.trim() ||
        !data.phone?.trim()
      ) {
        setResult(
          'Please complete your name, email and phone / WhatsApp number.'
        );

        return;
      }

      const validEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          data.workEmail.trim()
        );

      if (!validEmail) {
        setResult(
          'Please enter a valid email address.'
        );

        return;
      }
    }


    if (step === 2) {
      if (!data.projectName?.trim()) {
        setResult(
          'Please enter the project name.'
        );

        return;
      }
    }


    setResult('');

    setStep(current => current + 1);
  }


  /* ==================================================
     SUBMIT RFQ
  ================================================== */

  async function submit() {
    if (!data.products?.trim()) {
      setResult('Please enter the required products.');
      return;
    }

    setSending(true);
    setResult('Sending your quotation request...');

    try {
      const locale =
        typeof window !== 'undefined' &&
        window.location.pathname.startsWith('/ar')
          ? 'ar'
          : 'en';

      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale })
      });

      const json = await response.json();

      if (!response.ok || !json.ok) {
        const detail = json.errors
          ? Object.values(json.errors).join(' ')
          : '';

        setResult(
          (json.message ||
            'The quotation request could not be sent. Please try again.') +
            (detail ? ' ' + detail : '')
        );
        return;
      }

      setSuccessReference(json.reference);
      setResult('');
      setData({});
      setStep(1);
    } catch (error) {
      console.error('KIRMARY RFQ ERROR:', error);
      setResult(
        'The quotation request could not be sent. Please try again.'
      );
    } finally {
      setSending(false);
    }
  }

  /* ==================================================
     SUCCESS ENDING
  ================================================== */

  if (successReference) {
    return (
      <div className="rfq-success">

        <div className="rfq-success__icon">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M5 12.5 9.2 17 19 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="rfq-success__eyebrow">
          REQUEST RECEIVED
        </p>

        <h2>
          Thank you for choosing
          <br />
          KIRMARY.
        </h2>

        <p className="rfq-success__copy">
          Your quotation request has been submitted successfully.
          Our team will review your requirements and contact you
          using the details provided.
        </p>

        <div className="rfq-success__reference">
          <span>YOUR RFQ REFERENCE</span>

          <strong>
            {successReference}
          </strong>
        </div>

        <div className="rfq-success__status">
          <span />
          Successfully sent to KIRMARY
        </div>

        <button
          type="button"
          className="rfq-success__button"
          onClick={() => {
            setSuccessReference('');
            setResult('');
            setData({});
            setStep(1);
          }}
        >
          START A NEW REQUEST ↗
        </button>

      </div>
    );
  }


  /* ==================================================
     UI
  ================================================== */

  return (
    <div className="rfq-form">


      {/* STEP NUMBER */}

      <p className="rfq-step">
        STEP {step} / 3
      </p>


      {/* ==================================================
          STEP 1 — CONTACT INFORMATION
      ================================================== */}

      {step === 1 && (
        <div className="rfq-fields">

          <input
            type="text"
            name="fullName"
            placeholder="Full name"
            value={data.fullName || ''}
            onChange={update}
            autoComplete="name"
          />


          <input
            type="email"
            name="workEmail"
            placeholder="Work email"
            value={data.workEmail || ''}
            onChange={update}
            autoComplete="email"
          />


          <input
            type="tel"
            name="phone"
            placeholder="Phone / WhatsApp Number"
            value={data.phone || ''}
            onChange={update}
            autoComplete="tel"
          />

        </div>
      )}


      {/* ==================================================
          STEP 2 — PROJECT INFORMATION
      ================================================== */}

      {step === 2 && (
        <div className="rfq-fields">

          <input
            type="text"
            name="companyName"
            placeholder="Company name"
            value={data.companyName || ''}
            onChange={update}
          />


          <input
            type="text"
            name="projectName"
            placeholder="Project name"
            value={data.projectName || ''}
            onChange={update}
          />


          <input
            type="text"
            name="projectLocation"
            placeholder="Project location"
            value={data.projectLocation || ''}
            onChange={update}
          />

        </div>
      )}


      {/* ==================================================
          STEP 3 — PRODUCTS & REQUIREMENTS
      ================================================== */}

      {step === 3 && (
        <div className="rfq-fields single">

          <textarea
            name="products"
            placeholder="Required products"
            rows={3}
            value={data.products || ''}
            onChange={update}
          />


          <textarea
            name="quantities"
            placeholder="Required quantities"
            rows={3}
            value={data.quantities || ''}
            onChange={update}
          />


          <textarea
            name="technicalRequirements"
            placeholder="Technical requirements or additional notes"
            rows={4}
            value={
              data.technicalRequirements || ''
            }
            onChange={update}
          />

        </div>
      )}


      {/* ==================================================
          RESULT
      ================================================== */}

      {result && (
        <p className="rfq-result">
          {result}
        </p>
      )}


      {/* ==================================================
          ACTIONS
      ================================================== */}

      <div className="rfq-actions">

        {step > 1 && (
          <button
            type="button"
            disabled={sending}
            onClick={() => {
              setResult('');

              setStep(
                current => current - 1
              );
            }}
          >
            ← Back
          </button>
        )}


        {step < 3 ? (
          <button
            type="button"
            className="primary"
            onClick={nextStep}
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            className="primary"
            disabled={sending}
            onClick={submit}
          >
            {
              sending
                ? 'Sending…'
                : 'Submit RFQ'
            }
          </button>
        )}

      </div>

    </div>
  );
}


