import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
// import { Tags } from 'lucide-react';

const PostsPageSkeleton = () => {
    return (
        <div className="flex min-h-screen w-full bg-[#05140D]">
            <div className="flex-1 sm:py-3 bg-[#05140D] overflow-hidden">

                <div className="p-4 md:p-10 grid grid-cols-1 gap-8 w-full">
                    {/* Post Skeletons */}
                    {[...Array(3)].map((_, index) => (
                        <Card key={index} className="bg-[#13261F] text-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row w-full border-0">
                            <div className="flex-1 p-4">
                                <div className="relative">
                                    <Skeleton className="w-full h-96 rounded-lg bg-[#2C5440]" />
                                    {/* Tag skeleton */}
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <Skeleton className="h-6 w-20 rounded-full bg-[#2C5440]" />
                                        <Skeleton className="h-6 w-24 rounded-full bg-[#2C5440]" />
                                    </div>
                                    {/* Bookmark button skeleton */}
                                    <Skeleton className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-[#2C5440]" />
                                </div>
                                
                                <CardHeader className="flex flex-row items-center gap-4 p-4 border-b border-gray-700/50">
                                    <Skeleton className="h-12 w-12 rounded-full bg-[#2C5440]" />
                                    <div>
                                        <Skeleton className="h-5 w-32 mb-2 bg-[#2C5440]" />
                                        <Skeleton className="h-4 w-24 bg-[#2C5440]" />
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="p-4 flex-grow">
                                    <Skeleton className="h-4 w-full mb-2 bg-[#2C5440]" />
                                    <Skeleton className="h-4 w-4/5 mb-2 bg-[#2C5440]" />
                                    <Skeleton className="h-4 w-3/5 bg-[#2C5440]" />
                                </CardContent>
                                
                                <CardFooter className="flex lg:flex-row flex-col gap-6 md:gap-4 justify-between items-center border-t border-gray-700/50 pt-4">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-9 w-16 bg-[#2C5440]" />
                                        <Skeleton className="h-9 w-16 bg-[#2C5440]" />
                                        <Skeleton className="h-9 w-16 bg-[#2C5440]" />
                                    </div>
                                    <div className="flex gap-3">
                                        <Skeleton className="h-10 w-28 bg-[#2C5440]" />
                                        <Skeleton className="h-10 w-28 bg-[#2C5440]" />
                                    </div>
                                </CardFooter>
                            </div>
                            <div className="flex-2 p-4 pt-2 bg-[#0c2f1f] md:border-l border-t md:border-t-0 border-gray-600 md:min-w-[320px] md:max-w-[350px]">
                                <div className="flex flex-col w-full h-full justify-between">
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Skeleton className="h-5 w-5 rounded-full bg-[#2C5440]" />
                                            <Skeleton className="h-5 w-24 bg-[#2C5440]" />
                                        </div>
                                        <div className="max-h-[400px]">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="flex items-start gap-3 mt-3 p-3 rounded-lg bg-[#05140D]/50">
                                                    <Skeleton className="h-8 w-8 rounded-full bg-[#2C5440]" />
                                                    <div className="w-full">
                                                        <Skeleton className="h-4 w-24 mb-2 bg-[#2C5440]" />
                                                        <Skeleton className="h-4 w-full mb-2 bg-[#2C5440]" />
                                                        <Skeleton className="h-4 w-4/5 bg-[#2C5440]" />
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <Skeleton className="h-3 w-12 bg-[#2C5440]" />
                                                            <Skeleton className="h-3 w-12 bg-[#2C5440]" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="relative mt-4 flex flex-row bottom-0 items-center justify-evenly gap-2">
                                        <Skeleton className="h-10 w-full bg-[#2C5440]" />
                                        <Skeleton className="h-10 w-12 bg-[#2C5440] rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostsPageSkeleton;
