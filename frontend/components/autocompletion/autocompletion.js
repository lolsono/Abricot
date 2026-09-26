"use client";

import { useEffect, useState } from "react";
import { searchUsers } from "@/services/usersServices";
import styles from "./autocompletion.module.css";

export default function UserSelector({ value = [], onChange }) {
const [search, setSearch] = useState("");
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
    if (search.trim().length < 2) {
        setUsers([]);
        return;
    }

    const timeout = setTimeout(async () => {
        try {
            setLoading(true);

            const results = await searchUsers(search);

            if (results?.success) {
                setUsers(results.data?.users ?? []);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error(
                "Erreur recherche utilisateurs :",
                error
            );

            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, 300);

    return () => clearTimeout(timeout);
}, [search]);

const addUser = (user) => {
    if (value.some((item) => item.id === user.id)) {
        return;
    }

    onChange([...value, user]);

    setSearch("");
    setUsers([]);
};

const removeUser = (userId) => {
    onChange(
        value.filter((user) => user.id !== userId)
    );
};

return (
    <div className={styles.selectGroup}>

        <input
            id="user-search"
            aria-label="Rechercher un colaborateur"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un collaborateur..."
        />

        {loading && (
            <div>Recherche...</div>
        )}

        {!loading && users.length > 0 && (
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <button
                            type="button"
                            onClick={() => addUser(user)}
                        >
                            {user.name}
                        </button>
                    </li>
                ))}
            </ul>
        )}

        {!loading &&
            search.trim().length >= 2 &&
            users.length === 0 && (
                <div>
                    Aucun utilisateur trouvé
                </div>
            )}

        <div>
            {value.map((user) => (
                <span key={user.id}>
                    {user.name}

                    <button
                        type="button"
                        onClick={() => removeUser(user.id)}
                    >
                        ×
                    </button>
                </span>
            ))}
        </div>

    </div>
);


}