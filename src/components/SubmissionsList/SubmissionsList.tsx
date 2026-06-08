import { selectAllSubmissions } from '../../store/submissionsSlice';
import { useAppSelector } from '../../store/hooks';
import { SubmissionCard } from '../SubmissionCard/SubmissionCard';
import './SubmissionsList.css';

export function SubmissionsList() {
  const submissions = useAppSelector(selectAllSubmissions);

  if (submissions.length === 0) {
    return (
      <div className="submissions-list__empty" aria-live="polite">
        Waiting for your first profile submission.
      </div>
    );
  }

  return (
    <ul className="submissions-list" aria-live="polite">
      {submissions.map((submission) => (
        <li key={submission.id}>
          <SubmissionCard submission={submission} />
        </li>
      ))}
    </ul>
  );
}
