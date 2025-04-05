import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // or wherever you initialize Supabase
import { useSearchParams } from 'react-router-dom';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Grab the token (access_token) from the URL query string
    useEffect(() => {
        const accessToken = searchParams.get('access_token'); // e.g. ?access_token=XYZ
        if (accessToken) {
            setToken(accessToken);
        } else {
            setError('No token found. The link may be invalid or expired.');
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            // Supabase: verify this "recovery" token and set the new password
            const { data, error } = await supabase.auth.verifyOtp({
                token,
                type: 'recovery',
                newPassword,
            });
            if (error) throw error;

            // If you do NOT want the user to be automatically logged in, log them out:
            await supabase.auth.signOut();

            setMessage('Your password has been updated! Please sign in with your new password.');
        } catch (err) {
            setError(err.message || 'An error occurred while resetting your password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
            <h2>Reset Password</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            {!message && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>New Password</label>
                        <input
                            type="password"
                            disabled={loading}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading || !newPassword}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default ResetPassword;
