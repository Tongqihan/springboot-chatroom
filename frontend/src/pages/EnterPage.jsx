import { EntryForm } from '../components/EntryForm';

function EnterPage({ defaultRoom, onEnter }) {
  return <EntryForm defaultRoom={defaultRoom} onEnter={onEnter} />;
}

export default EnterPage;
