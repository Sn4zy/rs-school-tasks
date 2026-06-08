import { useEffect } from 'react';
import { clearSubmissionHighlight, selectAllSubmissions } from '../../store/submissionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { FormSubmission } from '../../types/submission';
import './SubmissionCard.css';

interface SubmissionCardProps {
  submission: FormSubmission;
}

const SOURCE_LABELS = {
  uncontrolled: 'Uncontrolled form',
  'hook-form': 'React Hook Form',
} as const;

function formatGender(gender: string): string {
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDate));
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const dispatch = useAppDispatch();
  const submissions = useAppSelector(selectAllSubmissions);
  const currentSubmission =
    submissions.find((item) => item.id === submission.id) ?? submission;
  const { id, source, submittedAt, data, isNew } = currentSubmission;

  useEffect(() => {
    if (!isNew) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch(clearSubmissionHighlight(id));
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dispatch, id, isNew]);

  return (
    <article
      className={`result-card${isNew ? ' is-new' : ''}`}
      aria-label={`Submission from ${SOURCE_LABELS[source]}`}
      data-testid="submission-card"
    >
      <header className="card-header">
        <span className={`source-badge ${source}`}>{SOURCE_LABELS[source]}</span>
        <time className="submitted-date" dateTime={submittedAt}>
          {formatDate(submittedAt)}
        </time>
      </header>

      <img
        className="profile-image"
        src={data.imageBase64}
        alt={`Profile of ${data.name}`}
      />

      <dl className="card-details">
        <div className="detail-item">
          <dt>Name</dt>
          <dd>{data.name}</dd>
        </div>
        <div className="detail-item">
          <dt>Age</dt>
          <dd>{data.age}</dd>
        </div>
        <div className="detail-item">
          <dt>Email</dt>
          <dd>{data.email}</dd>
        </div>
        <div className="detail-item">
          <dt>Gender</dt>
          <dd>{formatGender(data.gender)}</dd>
        </div>
        <div className="detail-item">
          <dt>Country</dt>
          <dd>{data.country}</dd>
        </div>
        <div className="detail-item">
          <dt>Terms accepted</dt>
          <dd>{data.acceptedTerms ? 'Yes' : 'No'}</dd>
        </div>
      </dl>
    </article>
  );
}
