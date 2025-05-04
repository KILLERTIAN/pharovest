import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
    return (
        <div className="relative h-[400px] w-full max-w-sm mx-auto overflow-hidden rounded-xl shadow-sm bg-[#1A3A2C]">
            {/* Image Container */}
            <div className="h-[150px] w-full overflow-hidden ">
                <Skeleton className="h-full w-full object-cover bg-[#05140D]" />
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Title Box */}
                <Skeleton className="h-6 w-1/2 mb-4 bg-[#2C5440]" />

                {/* Avatar and Name */}
                <div className="flex flex-row items-center mb-4">
                    <Skeleton className="h-10 w-10 rounded-full bg-[#2C5440]" />
                    <Skeleton className="ml-2 h-4 w-1/3 bg-[#2C5440]" />
                </div>

                {/* Description Box */}
                <Skeleton className="h-4 w-full mb-4 bg-[#2C5440]" />
                <Skeleton className="h-4 w-full mb-4 bg-[#2C5440]" />
                <Skeleton className="h-4 w-full bg-[#2C5440]" />

                {/* Bottom Containers */}
                <div className="mt-4 flex justify-between">
                    <Skeleton className="h-6 w-1/3 bg-[#2C5440]" />
                    <Skeleton className="h-6 w-1/3 bg-[#2C5440]" />
                </div>
            </div>
        </div>
    );
}
