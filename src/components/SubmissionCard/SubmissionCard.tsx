import { useEffect } from 'react';
import { clearSubmissionHighlight } from '../../store/submissionsSlice';
import { useAppDispatch } from '../../store/hooks';
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
  const { id, source, submittedAt, data, isNew } = submission;

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
      className={`submission-card${isNew ? ' submission-card--new' : ''}`}
      aria-label={`Submission from ${SOURCE_LABELS[source]}`}
      data-testid="submission-card"
    >
      <header className="submission-card__header">
        <span className={`submission-card__badge submission-card__badge--${source}`}>
          {SOURCE_LABELS[source]}
        </span>
        <time className="submission-card__date" dateTime={submittedAt}>
          {formatDate(submittedAt)}
        </time>
      </header>

      <dl className="submission-card__details">
        <div className="submission-card__detail">
          <dt>Name</dt>
          <dd>{data.name}</dd>
        </div>
        <div className="submission-card__detail">
          <dt>Age</dt>
          <dd>{data.age}</dd>
        </div>
        <div className="submission-card__detail">
          <dt>Email</dt>
          <dd>{data.email}</dd>
        </div>
        <div className="submission-card__detail">
          <dt>Gender</dt>
          <dd>{formatGender(data.gender)}</dd>
        </div>
        <div className="submission-card__detail">
          <dt>Terms accepted</dt>
          <dd>{data.acceptedTerms ? 'Yes' : 'No'}</dd>
        </div>
      </dl>
    </article>
  );
}
