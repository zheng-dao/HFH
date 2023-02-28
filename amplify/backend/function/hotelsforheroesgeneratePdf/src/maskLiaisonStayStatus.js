const maskLiaisonStayStatus = (status) => {
  if (['REVIEWED', 'CLOSED'].includes(status)) {
    return 'COMPLETED';
  }
  return status;
};

export default maskLiaisonStayStatus;
