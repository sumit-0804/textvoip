"use client";

import axios from "axios";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useModal } from "@/hooks/useModalStore";

const formSchema = z.object({
    inviteUrl: z.string().min(1, {
        message: "Invite Url is required"
    }),

})

export const JoinModal = () => {
    const { isOpen, onOpen, onClose, type } = useModal();
    const [isMounted, SetIsMounted] = useState(false);

    const isModalOpen = isOpen && type === 'joinViaLink';

    const router = useRouter();

    useEffect(() => {
        SetIsMounted(true);
    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            inviteUrl: "",
        }
    });

    const isLoading = form.formState.isLoading;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            onClose();
            router.push(values.inviteUrl);
            // router.refresh();
        } catch (error) {
            console.log(error);
        }
    }

    if (!isMounted) {
        return null;
    }

    return (
        <Dialog open={isModalOpen}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl tex-center font-bodl">
                        Join The Server Via Link
                    </DialogTitle>
                    <DialogDescription className=" text-center text-zinc-500">
                        Join the new community!
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6'>

                            <FormField control={form.control} name='inviteUrl' render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                        Invite Link
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading}
                                            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                            placeholder="Enter Invite Link"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <div className="flex justify-between items-center w-full">
                                <Button className="text-zinc-600 bg-transparent underline" onClick={() => onOpen('createServer')} size='sm' type="button">Create Server</Button>
                                <Button variant="primary" disabled={isLoading}>
                                    Join
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
}