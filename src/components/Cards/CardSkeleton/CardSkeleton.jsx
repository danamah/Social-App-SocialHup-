import { Card, Skeleton } from "@heroui/react";
export default function CardSkeleton() {
    return (
        <>
            <Card className="space-y-5 p-4 my-3" radius="lg">
                <div className="flex items-center g-2">
                    <div>
                        <Skeleton className="flex rounded-full w-12 h-12" />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <Skeleton className="h-3 w-3/5 rounded-lg" />
                        <Skeleton className="h-3 w-4/5 rounded-lg" />
                    </div>
                </div>
                <Skeleton className="rounded-lg">
                    <div className="h-24 rounded-lg bg-default-300" />
                </Skeleton>
                <div className="space-y-3">
                    <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className="w-2/5 rounded-lg">
                        <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                    </Skeleton>
                </div>
            </Card>
        </>
    )
}

