import React from 'react';
import { withKeycloak } from '@react-keycloak/web'

function DashboardContainer(a: any) {
    return (
        <React.Fragment>
            <p>
                Dashboard container
            </p>
            <p>{JSON.stringify(a)}</p>
            {
                <button onClick={() => a.keycloak.login()}>Login</button>
            }
        </React.Fragment>
        

    );
}

export default withKeycloak(DashboardContainer)  