import React, { useState, useEffect } from 'react';
import '../../styles/Form.css'
import { useNavigate } from "react-router-dom";


export const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [first_name, setFirst_Name] = useState('');
    const [last_name, setLast_Name] = useState('');

    //Optional (Future)
    let [country, setCountry] = useState(1);
    const [countryList, setCountryList] = useState([{ 'name': '', 'id': '' }]);

    const API_URL = 'http://localhost:4000/';
    const navigate = useNavigate();
    const [error, setError] = useState('');


    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await fetch(API_URL + 'countries');
            const data = await response.json();
            setCountryList(data);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') setUsername(value);
        if (name === 'password') setPassword(value);
        if (name === 'email') setEmail(value);
        if (name === 'first_name') setFirst_Name(value);
        if (name === 'last_name') setLast_Name(value);
        if (name === 'country') {
            country = e.target.value;
            setCountry(e.target.value)
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_URL + 'api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email, first_name, last_name }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.accessToken) {
                    localStorage.setItem('user', JSON.stringify({ username, password, email, first_name, last_name }));
                }
                navigate('/get-started');

            } else {
                throw new Error('Register failed.');
            }
        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <div className="form-container">
            <h2>REGISTER</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>USERNAME</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>PASSWORD</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>EMAIL</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>FIRST NAME</label>
                    <input
                        type="text"
                        name="first_name"
                        value={first_name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>LAST NAME</label>
                    <input
                        type="text"
                        name="last_name"
                        value={last_name}
                        onChange={handleInputChange}
                        required
                    />
                </div>


                <div className="form-group">
                    <label>COUNTRY
                        <select className="form-control" name="country" value={country} onChange={handleInputChange}>
                            {countryList.map(country => (
                                <option value={country.id} key={country.id} >{country.name}</option>
                            ))
                            }
                        </select>
                    </label>
                </div>

                <div className="form-group">
                    <button type="submit">REGISTER</button>
                </div>
            </form>
        </div>
    );
};