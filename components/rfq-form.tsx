'use client';

import {
  useState,
  type ChangeEvent
} from 'react';

type FormData = Record<string, string>;

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
};

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
     REFERENCE NUMBER
  ================================================== */

  function createReference() {
    const date = new Date();

    const datePart = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('');

    const randomPart =
      Math.random()
        .toString(36)
        .slice(2, 7)
        .toUpperCase();

    return `RFQ-${datePart}-${randomPart}`;
  }


  /* ==================================================
     SEND ONE WEB3FORMS REQUEST
  ================================================== */

  async function sendToWeb3Forms(
    accessKey: string,
    reference: string
  ) {
    const response = await fetch(
      'https://api.web3forms.com/submit',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },

        body: JSON.stringify({
          access_key: accessKey,

          subject:
            `New KIRMARY RFQ Request — ${reference}`,

          from_name:
            'KIRMARY Website RFQ',

          /*
            IMPORTANT:
            Web3Forms uses "email" as Reply-To.
            So Reply goes directly to the customer.
          */

          email:
            data.workEmail?.trim(),

          'RFQ Reference':
            reference,

          'Full Name':
            data.fullName?.trim(),

          'Work Email':
            data.workEmail?.trim(),

          'Phone / WhatsApp':
            data.phone?.trim(),

          'Company Name':
            data.companyName?.trim() ||
            'Not provided',

          'Project Name':
            data.projectName?.trim(),

          'Project Location':
            data.projectLocation?.trim() ||
            'Not provided',

          'Required Products':
            data.products?.trim(),

          'Required Quantities':
            data.quantities?.trim() ||
            'Not provided',

          'Technical Requirements / Notes':
            data.technicalRequirements?.trim() ||
            'Not provided'
        })
      }
    );

    const json =
      (await response.json()) as Web3FormsResponse;

    if (!response.ok || !json.success) {
      throw new Error(
        json.message ||
        'Web3Forms submission failed.'
      );
    }

    return json;
  }


  /* ==================================================
     SUBMIT RFQ
  ================================================== */

  async function submit() {
    if (!data.products?.trim()) {
      setResult(
        'Please enter the required products.'
      );

      return;
    }


    const salesKey =
      process.env
        .NEXT_PUBLIC_WEB3FORMS_SALES_KEY;

    const infoKey =
      process.env
        .NEXT_PUBLIC_WEB3FORMS_INFO_KEY;


    if (!salesKey || !infoKey) {
      setResult(
        'RFQ email service is not configured yet.'
      );

      return;
    }


    const reference =
      createReference();


    setSending(true);

    setResult(
      'Sending your quotation request…'
    );


    try {
      /*
        SAME RFQ IS SENT TWICE:

        1. Sales form
        2. Info form

        Both receive the SAME reference number.
      */

      await Promise.all([
        sendToWeb3Forms(
          salesKey,
          reference
        ),

        sendToWeb3Forms(
          infoKey,
          reference
        )
      ]);


      setSuccessReference(reference);
setResult('');
setData({});
setStep(1);

    } catch (error) {
      console.error(
        'KIRMARY RFQ ERROR:',
        error
      );

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