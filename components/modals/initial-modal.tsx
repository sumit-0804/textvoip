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
import { FileUpload } from '@/components/file-upload';
import { useModal } from "@/hooks/useModalStore";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server Name is required"
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required"
    })
})

export const IntialModal = () => {
    const { onOpen } = useModal();
    const [isMounted, SetIsMounted] = useState(false);

    const router = useRouter();

    useEffect(() => {
        SetIsMounted(true);
    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });

    const isLoading = form.formState.isLoading;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post('/api/servers', values);

            form.reset();
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.log(error);

        }
    }

    if (!isMounted) {
        return null;
    }

    const handleClick = () => {
        onOpen('joinViaLink');
        SetIsMounted(false);
    }

    return (
        <Dialog open={isMounted}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl tex-center font-bodl">
                        Customize Your Server
                    </DialogTitle>
                    <DialogDescription className=" text-center text-zinc-500">
                        Give Server your customization with a name and an image. You can always change it later!
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6'>
                            <div className="flex items-center justify-center text-center">
                                <FormField control={form.control} name='imageUrl' render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )} />


                            </div>

                            <FormField control={form.control} name='name' render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                        Server Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading}
                                            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                            placeholder="Enter Server Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <div className="flex justify-between items-center w-full">
                                <Button className="text-zinc-600 bg-transparent underline" onClick={handleClick} size='sm' type="button">Join Via Link</Button>
                                <Button variant="primary" disabled={isLoading}>
                                    Create
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}