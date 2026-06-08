import { selectAllSubmissions } from '../../store/submissionsSlice';
import { useAppSelector } from '../../store/hooks';
import { SubmissionsList } from '../SubmissionsList/SubmissionsList';
import './SubmissionsSection.css';

export function SubmissionsSection() {
  const submissions = useAppSelector(selectAllSubmissions);

  return (
    <section className="submissions-panel" aria-labelledby="submissions-heading">
      <div className="panel-header">
        <h2 id="submissions-heading">Submission history</h2>
        <p>
          {submissions.length === 0
            ? 'No submissions yet. Complete a form to see your data here.'
            : `${submissions.length} submission${submissions.length === 1 ? '' : 's'} saved in Redux.`}
        </p>
      </div>
      <SubmissionsList />
    </section>
  );
}
