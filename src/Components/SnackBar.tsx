"use client";

import * as React from 'react';
import Snackbar from '@mui/joy/Snackbar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';

type SnackbarWithDecoratorsProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    width?: string | number;
    height?: string | number;
    message: string;
    backgroundColor?: string;
    textColor?: string;
    actionLabel?: string;
    onAction?: () => void;
    showAction?: boolean;
};


export default function SnackbarWithDecorators({ open, setOpen, width, height, message, backgroundColor = '#3B3A3F', textColor = 'var(--lima)', actionLabel, onAction, showAction = false }: SnackbarWithDecoratorsProps) {

    return (
        <React.Fragment>
      
            <Snackbar
                variant="soft"
                color="success"
                open={open}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                sx={{
                    width: width ?? 'fit-content',
                    minWidth: 'auto',
                    maxWidth: 260,
                    height: height,
                    backgroundColor: backgroundColor,
                    color: textColor,
                    px: 1.5,
                    py: 0.75,
                    display: 'inline-flex',
                    border: '2px solid #d2ffec',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.45), 0 0 18px rgba(193,253,53,0.06)'
                }}

            >
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ lineHeight: 1 }}>{message}</Box>
                    {showAction && (
                        <Button
                            size="sm"
                            variant="plain"
                            onClick={() => {
                                try {
                                    onAction?.();
                                } catch {
                                }
                                setOpen(false);
                            }}
                            sx={{
                                backgroundColor: 'var(--lima)',
                                color: 'var(--dark)',
                                minWidth: 'auto',
                                px: 1,
                                py: 0.25,
                                borderRadius: '8px',
                                boxShadow: '0 6px 18px rgba(0,0,0,0.8)'

                            }}
                        >
                            {actionLabel ?? 'OK'}
                        </Button>
                    )}
                </Box>
            </Snackbar>
        </React.Fragment>
    );
}
