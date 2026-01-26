import { Skeleton } from "@/components/ui/skeleton";

const ProjectDetailedViewSkeleton = () => (
    <div className="flex min-h-screen w-full bg-[#05140D]">
        <div className="flex-1 sm:py-3 sm:pl-14 bg-[#05140D] overflow-hidden w-full">
            {/* Header Skeleton */}
            <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-[#1A3A2C] border-b border-[#2C5440]">
                <Skeleton className="h-8 w-2/5 bg-[#2C5440]" />
                <div className="flex flex-row items-center gap-4">
                    <Skeleton className="h-10 w-32 hidden sm:block bg-[#2C5440]" />
                    <Skeleton className="h-10 w-10 rounded-full bg-[#2C5440]" />
                </div>
            </header>
            <div className="w-full mx-auto p-5 gap-6 flex flex-col md:flex-row">
                {/* Flex-1 Container Skeleton */}
                <div className="flex-1 bg-[#2C5440] rounded-xl shadow p-8">
                    <Skeleton className="h-80 w-full rounded-lg bg-[#1A3A2C]" />
                    <Skeleton className="h-10 w-3/5 mt-5 bg-[#1A3A2C]" />
                    <div className="flex items-center mt-4">
                        <Skeleton className="h-10 w-10 rounded-full bg-[#1A3A2C]" />
                        <Skeleton className="h-6 w-1/3 ml-2 bg-[#1A3A2C]" />
                    </div>
                    <Skeleton className="h-6 w-full mt-4 bg-[#1A3A2C]" />
                    <Skeleton className="h-6 w-4/5 mt-2 bg-[#1A3A2C]" />
                </div>

                {/* Flex-2 Container Skeleton */}
                <div className="flex-2 bg-[#2C5440] rounded-xl shadow p-8 relative min-w-[30%] items-center">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col items-start">
                            <Skeleton className="h-10 w-3/5 bg-[#1A3A2C]" />
                            <Skeleton className="h-5 w-24 mt-2 bg-[#1A3A2C]" />
                        </div>
                        <Skeleton className="h-8 w-1/3 bg-[#1A3A2C]" />
                        <Skeleton className="h-8 w-2/5 bg-[#1A3A2C]" />
                    </div>

                    <div className="relative my-4 md:mb-10 py-4">
                        <Skeleton className="absolute left-[8px] top-0 bottom-0 w-2 bg-[#1A3A2C] rounded-full" />

                        <div className="space-y-4 pl-[2px]">
                            <div className="flex flex-row items-center gap-4">
                                <Skeleton className="h-5 w-5 rounded-full bg-[#1A3A2C]" />
                                <Skeleton className="h-6 w-4/5 bg-[#1A3A2C]" />
                            </div>

                            <div className="flex flex-row items-center gap-4">
                                <Skeleton className="h-5 w-5 rounded-full bg-[#1A3A2C]" />
                                <Skeleton className="h-6 w-4/5 bg-[#1A3A2C]" />
                            </div>
                            <div className="flex flex-row items-center gap-4">
                                <Skeleton className="h-5 w-5 rounded-full bg-[#1A3A2C]" />
                                <Skeleton className="h-6 w-4/5 bg-[#1A3A2C]" />
                            </div>
                            <div className="flex flex-row items-center gap-4">
                                <Skeleton className="h-5 w-5 rounded-full bg-[#1A3A2C]" />
                                <Skeleton className="h-6 w-4/5 bg-[#1A3A2C]" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row gap-4 py-4">
                        <Skeleton className="h-10 w-32 bg-[#1A3A2C]" />
                        <Skeleton className="h-10 w-28 bg-[#1A3A2C]" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ProjectDetailedViewSkeleton;
