import useAuth from '@contexts/AuthContext';
import AdminPdf from '@components/PDFs/admin';
import LiaisonPdf from '@components/PDFs/liaison';
import ItineraryPdf from '@components/PDFs/itinerary';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { Storage, API } from 'aws-amplify';
import humanName from '@utils/humanName';
import useDialog from '@contexts/DialogContext';
import retrieveFirstCheckin from '@utils/retrieveFirstCheckin';
import retrieveLatestCheckout from '@utils/retrieveLatestCheckout';
import useButtonWait from '@contexts/ButtonWaitContext';
import { saveAs } from 'file-saver';
import Link from 'next/link';
import { useRouter } from 'next/router';
import format from 'date-fns/format';
import { makeTimezoneAwareDate } from '@utils/makeTimezoneAwareDate';
import { STAYSTATUS } from '@src/API';

export default function ApplicationFiles(props) {
  const { isAdministrator, profile } = useAuth();
  const { setMessage } = useDialog();
  const { setIsWaiting } = useButtonWait();
  const { router } = useRouter();

  const [hotelLogo, setHotelLogo] = useState(null);
  const [isInEmailMode, setIsInEmailMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [additionalEmails, setAdditionalEmails] = useState('');

  let emailBodyText = `Please see the attached file(s) sent to you by ` +
    humanName(profile) +
    ' related to the application for ' +
    props.serviceMemberName +
    '.';


  useEffect(() => {
    emailBodyText = `Please see the attached file(s) sent to you by ` +
      humanName(profile) +
      ' related to the application for ' +
      props.serviceMemberName
      + '.';
    setAdditionalText(emailBodyText)
  }, [props.serviceMemberName])

  const [additionalText, setAdditionalText] = useState(emailBodyText);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const stays = [props.initialStay].concat(props.extendedStays);

  useEffect(() => {
    if (props.initialStay) {
      if (props.initialStay?.HotelBooked?.HotelBrand) {
        if (props.initialStay?.HotelBooked?.HotelBrand.logo) {
          Storage.get(props.initialStay?.HotelBooked?.HotelBrand.logo, {
            level: 'public',
          })
            .then((result) => {
              setHotelLogo(result);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }
  }, [props.initialStay]);

  const staysToCheck = () => {
    if (props.application?.InitialStay) {
      return props.application.InitialStay.items.concat(props.application?.ExtendedStays?.items || []);
    }
    return props.application?.ExtendedStays?.items || [];
  };

  const toggleIsInEmailMode = (e) => {
    e.preventDefault();
    setIsInEmailMode((prev) => !prev);
    setSelectedFiles([]);
    setSelectedEmails([]);
    setAdditionalEmails('');
    setAdditionalText(emailBodyText);
  };

  const toggleFileSelection = (e) => {
    if (e.target.checked) {
      setSelectedFiles((prev) => [...prev, e.target.value]);
    } else {
      setSelectedFiles((prev) => prev.filter((item) => item !== e.target.value));
    }
  };

  const updateAdditionalEmails = (e) => {
    e.preventDefault();
    setAdditionalEmails(e.target.value);
  };

  const updateAdditionalText = (e) => {
    setAdditionalText(e.target.value);
  };

  const toggleEmailSelection = (e) => {
    if (e.target.checked) {
      setSelectedEmails((prev) => [...prev, e.target.value]);
    } else {
      setSelectedEmails((prev) => prev.filter((item) => item !== e.target.value));
    }
  };

  const emailRecipientOptions = () => {
    let results = [];
    if (props.application?.AssignedTo) {
      results.push({
        key: 'Admin',
        email: props.application?.AssignedTo.username,
        value:
          humanName(props.application?.AssignedTo) + ', ' + props.application?.AssignedTo.username,
      });
    }
    if (props.application?.User && props.application?.User?.username) {
      results.push({
        key: 'Liaison',
        email: props.application?.User.username,
        value: humanName(props.application?.User) + ', ' + props.application?.User.username,
      });
    }
    if (props.applicant && props.applicant.email) {
      results.push({
        key: 'Referrer',
        email: props.applicant.email,
        value: humanName(props.applicant) + ', ' + props.applicant.email,
      });
    }
    if (props.application?.ServiceMember && props.application?.ServiceMember?.email) {
      results.push({
        key: 'Service Member',
        email: props.application?.ServiceMember?.email,
        value:
          humanName(props.application?.ServiceMember) +
          ', ' +
          props.application?.ServiceMember.email,
      });
    }
    if (
      props.application?.PrimaryGuest.items[0] &&
      props.application?.PrimaryGuest.items[0].email
    ) {
      results.push({
        key: 'Primary Guest',
        email: props.application?.PrimaryGuest.items[0].email,
        value:
          humanName(props.application?.PrimaryGuest.items[0]) +
          ', ' +
          props.application?.PrimaryGuest.items[0].email,
      });
    }
    return results;
  };

  const sendEmailWithFiles = async (e) => {
    e.preventDefault();
    if (selectedEmails.length == 0 && additionalEmails.length <= 5) {
      setMessage('Please select at least 1 email address to send the files to.');
      return;
    }
    if (selectedFiles.length == 0) {
      setMessage('Please select at least 1 file to email.');
      return;
    }
    setButtonDisabled(true);
    setIsWaiting(true);
    let messageText =
      additionalText.trim().length > 0
        ? additionalText
        : emailBodyText;

    let results = await API.post('Utils', '/utils/email-files', {
      body: {
        emails: selectedEmails
          .concat(additionalEmails.split(',').map((item) => item.trim()))
          .filter((n) => n),
        message: messageText,
        attachments: selectedFiles,
        application: props.application,
        stays: stays,
        service_member_name: humanName(props.application?.ServiceMember),
        initial_check_in: retrieveFirstCheckin(props.application?.InitialStay.items[0]),
        final_check_out: retrieveLatestCheckout(staysToCheck()),
      },
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
    });

    setMessage('Email sent!');
    setIsInEmailMode(false);
    setSelectedFiles([]);
    setSelectedEmails([]);
    setAdditionalEmails('');
    setAdditionalText('');
    setButtonDisabled(false);
    setIsWaiting(false);
  };

  const handleItineraryPdfClick = (e, stay) => {
    e.preventDefault();
    pdf(
      <ItineraryPdf
        application={props.application}
        applicant={props.applicant}
        stay={stay ? stay : props.initialStay}
        hotelLogo={hotelLogo}
      />
    )
      .toBlob()
      .then((data) => {
        saveAs(data, 'itinerary.pdf');
      })
      .catch((e) => {
        setMessage('There was an error generating the PDF file. Please try again later.');
        Logger.info('Error generating itinerary PDF.', e);
      });
  };

  const handleAdminPdfClick = (e) => {
    e.preventDefault();
    pdf(
      <AdminPdf
        application={props.application}
        applicant={props.applicant}
        initialStay={props.initialStay}
      />
    )
      .toBlob()
      .then((data) => {
        saveAs(data, 'admin.pdf');
      })
      .catch((e) => {
        setMessage('There was an error generating the PDF file. Please try again later.');
        Logger.info('Error generating admin PDF.', e);
      });
  };

  const handleLiaisonPdfClick = (e) => {
    e.preventDefault();
    pdf(
      <LiaisonPdf
        application={props.application}
        applicant={props.applicant}
        initialStay={props.initialStay}
      />
    )
      .toBlob()
      .then((data) => {
        saveAs(data, 'liaison.pdf');
      })
      .catch((e) => {
        setMessage('There was an error generating the PDF file. Please try again later.');
        Logger.info('Error generating liaison PDF.', e);
      });
  };

  if (!props.application) {
    return null;
  }

  return (
    <div className="files app-pane">
      <div className="pdf-panel">
        <div>
          <h3>Files</h3>
          <div className="files">
            <ul>
              {stays?.map((stay) => {
                return (
                  (stay?.status === STAYSTATUS.APPROVED || stay?.status === STAYSTATUS.COMPLETED || stay?.status === STAYSTATUS.REVIEWED || stay?.status === STAYSTATUS.CLOSED) &&
                  <li key={stay.id}>
                    {isInEmailMode && (
                      <input
                        type="checkbox"
                        value={'itinerary|' + stay.id}
                        defaultChecked={selectedFiles.includes('itinerary-' + stay.id)}
                        onChange={toggleFileSelection}
                      />
                    )}
                    {/* <Link href={'/application/' + stay.id + '/itinerary'}>
                      <a target={'_blank'}>{props.serviceMemberName} Itinerary {'('}{props?.initialStay?.requested_check_in ? format(makeTimezoneAwareDate(props?.initialStay?.requested_check_in), 'MM/dd/yyyy') : ''} {' - '} {props?.initialStay?.requested_check_out ? format(makeTimezoneAwareDate(props?.initialStay?.requested_check_out), 'MM/dd/yyyy') : ''
                      }{')'}</a>
                    </Link> */}
                    <a href="" onClick={(e) => handleItineraryPdfClick(e, stay)} download="itinerary.pdf">
                      {props.serviceMemberName} Itinerary {'('}{stay?.requested_check_in ? format(makeTimezoneAwareDate(stay.requested_check_in), 'MM/dd/yyyy') : ''} {' - '} {stay.requested_check_out ? format(makeTimezoneAwareDate(stay.requested_check_out), 'MM/dd/yyyy') : ''
                      }{')'}
                    </a>
                  </li>
                );
              })}
              {/* {hotelLogo != null && (
                <li>
                  {isInEmailMode && (
                    <input
                      type="checkbox"
                      value="itinerary"
                      defaultChecked={selectedFiles.includes('itinerary')}
                      onChange={toggleFileSelection}
                    />
                  )}
                  <a href="" onClick={handleItineraryPdfClick} download="itinerary.pdf">
                    {props.serviceMemberName} Itinerary {'('}{props?.initialStay?.requested_check_in ? format(makeTimezoneAwareDate(props?.initialStay?.requested_check_in), 'MM/dd/yyyy') : ''} {' - '} {props?.initialStay?.requested_check_out ? format(makeTimezoneAwareDate(props?.initialStay?.requested_check_out), 'MM/dd/yyyy') : ''
                    }{')'}
                  </a>
                </li>
              )} */}
              {isAdministrator() && (
                <li>
                  {isInEmailMode && (
                    <input
                      type="checkbox"
                      value="admin"
                      defaultChecked={selectedFiles.includes('admin')}
                      onChange={toggleFileSelection}
                    />
                  )}
                  {/* <Link href={'/application/' + props.application.id + '/admin'}>
                    <a target={'_blank'}>{props.serviceMemberName} {'('}{(props?.initialStay?.status === STAYSTATUS.COMPLETED || props?.initialStay?.status === STAYSTATUS.REVIEWED) ? format(makeTimezoneAwareDate(props?.initialStay?.actual_check_in), 'MM/dd/yyyy') : props?.initialStay?.requested_check_in ? format(makeTimezoneAwareDate(props?.initialStay?.requested_check_in), 'MM/dd/yyyy') : ''} {' - '} {retrieveLatestCheckout(
                      props.application?.InitialStay?.items ? props.application?.InitialStay?.items.concat(props.application?.ExtendedStays?.items || []) : [].concat(props.application?.ExtendedStays?.items || [])
                    )}{')'} Administrative</a>
                  </Link> */}
                  <a href="" onClick={handleAdminPdfClick} download="admin.pdf">
                    {props.serviceMemberName} {'('}{(props?.initialStay?.status === STAYSTATUS.COMPLETED || props?.initialStay?.status === STAYSTATUS.REVIEWED) ? format(makeTimezoneAwareDate(props?.initialStay?.actual_check_in), 'MM/dd/yyyy') : props?.initialStay?.requested_check_in ? format(makeTimezoneAwareDate(props?.initialStay?.requested_check_in), 'MM/dd/yyyy') : ''} {' - '} {retrieveLatestCheckout(
                      staysToCheck()
                    )}{')'} Administrative
                  </a>
                </li>
              )}
              <li>
                {isInEmailMode && (
                  <input
                    type="checkbox"
                    value="liaison"
                    defaultChecked={selectedFiles.includes('liaison')}
                    onChange={toggleFileSelection}
                  />
                )}
                {/* <Link href={'/application/' + props.application.id + '/liaison'}>
                  <a target={'_blank'}>{props.serviceMemberName} {'('}{(props?.initialStay?.status === STAYSTATUS.COMPLETED || props?.initialStay?.status === STAYSTATUS.REVIEWED) ? format(makeTimezoneAwareDate(props?.initialStay?.actual_check_in), 'MM/dd/yyyy') : props?.initialStay?.requested_check_in ? format(makeTimezoneAwareDate(props?.initialStay?.requested_check_in), 'MM/dd/yyyy') : ''} {' - '} {retrieveLatestCheckout(
                    props.application?.InitialStay?.items ? props.application?.InitialStay?.items.concat(props.application?.ExtendedStays?.items || []) : [].concat(props.application?.ExtendedStays?.items || [])
                  )}{')'} {isAdministrator() ? 'Liaison' : 'Application'}</a>
                </Link> */}
                <a href="" onClick={handleLiaisonPdfClick} download="liaison.pdf">
                  {props.serviceMemberName} {'('}{(props?.initialStay?.status === STAYSTATUS.COMPLETED || props?.initialStay?.status === STAYSTATUS.REVIEWED) ? format(makeTimezoneAwareDate(props?.initialStay?.actual_check_in), 'MM/dd/yyyy') : props?.initialStay?.requested_check_in ? format(makeTimezoneAwareDate(props?.initialStay?.requested_check_in), 'MM/dd/yyyy') : ''} {' - '} {retrieveLatestCheckout(
                    staysToCheck()
                  )}{')'} {isAdministrator() ? 'Liaison' : 'Application'}
                </a>
              </li>
            </ul>
          </div>
          {!isInEmailMode && (
            <div className="pdf-controls">
              <button type='button' className="send-email" onClick={toggleIsInEmailMode}>
                Email Files
              </button>
            </div>
          )}
          {isInEmailMode && (
            <div className="send-panel">
              <h4>Email Recipients</h4>
              <fieldset className="checkboxes custom">
                {emailRecipientOptions().map((item, index) => (
                  <label htmlFor={index} key={index}>
                    <input
                      id={index}
                      type="checkbox"
                      value={item.email}
                      defaultChecked={selectedEmails.includes(item.email)}
                      onChange={toggleEmailSelection}
                      className={selectedEmails.includes(item.email) ? 'checked' : ''}
                    />
                    {item.key} <span>{item.value}</span>
                  </label>
                ))}
              </fieldset>
              <label htmlFor="additional-file-text">Message</label>
              <textarea
                type="text"
                id="additional-file-text"
                value={additionalText}
                onChange={updateAdditionalText}
              />
              <label htmlFor="additional-file-emails">Additional Email Addresses</label>
              <input
                type="text"
                id="additional-file-emails"
                value={additionalEmails}
                onChange={updateAdditionalEmails}
              />
              <p className="ui-caption">(Separate addresses with commas)</p>
              <button type='button' className="cancel" onClick={toggleIsInEmailMode} disabled={buttonDisabled}>
                Cancel
              </button>
              <button type='button' className="send-email" onClick={sendEmailWithFiles} disabled={buttonDisabled}>
                Send Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ApplicationFiles.defaultProps = {
  serviceMemberName: '',
  applicationId: '',
  application: {},
  applicant: {},
  initialStay: {},
  extendedStays: []
};
