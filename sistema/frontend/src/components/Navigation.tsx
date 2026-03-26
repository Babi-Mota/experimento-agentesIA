import { Link } from 'react-router-dom';
import './Navigation.css';

export function Navigation() {
    return (
        <nav className="navigation">
            <div className="nav-container">
                <div className="nav-brand">
                    <h1>Exam System</h1>
                </div>
                <ul className="nav-menu">
                    <li>
                        <Link to="/">Questions</Link>
                    </li>
                    <li>
                        <Link to="/exams">Exams</Link>
                    </li>
                    <li>
                        <Link to="/reports">Reports</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
