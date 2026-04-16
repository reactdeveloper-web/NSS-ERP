import React from "react";
import { AuthenticatedPageShell } from "../Layout/AuthenticatedPageShell";
import { ReceiveIdCreationContent } from 'src/components/ReceiveIdCreation/ReceiveIdCreationContent';

export const ReceiveIdCreation: React.FC = () => {
    return(
    <>
        <AuthenticatedPageShell>
            <ReceiveIdCreationContent />
        </AuthenticatedPageShell>
    </>
    )
}
