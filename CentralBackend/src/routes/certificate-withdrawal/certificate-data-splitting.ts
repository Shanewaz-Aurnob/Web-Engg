export const certificateDataSplitting = (allData : any, pageLimit : number = allData?.length, currentPage: number = 1) =>{
    const totalRecords = allData?.length
    const startIndex = (currentPage - 1) * pageLimit;
    const endIndex = currentPage * pageLimit; 
    const data = allData?.slice(startIndex, endIndex)
    const result = {
        total_records: totalRecords,
        total_data: data?.length,
        data,
        page_count: Math.ceil(totalRecords / pageLimit),
        first_page: 1,
        next:
          endIndex < totalRecords
            ? {
                page: currentPage + 1,
                pageLimit,
              }
            : null,
        previous:
        currentPage > 1
            ? {
                page: currentPage - 1,
                pageLimit,
              }
            : null,
      };

      return result
}
