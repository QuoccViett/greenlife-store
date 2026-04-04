const SkeletonCard = () => {
    return (
        <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse'>
            <div className='aspect-square bg-gray-200' />
            <div className='p-4 space-y-2'>
                <div className='h-3 bg-gray-200 rounded w-1/2' />
                <div className='h-4 bg-gray-200 rounded w-full' />
                <div className='h-4 bg-gray-200 rounded w-2/3' />
            </div>
        </div>
    )

}

export default SkeletonCard