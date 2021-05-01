export interface ResetPasswordData {
  displayName?: string;
  email: string;
  url: string;
}

export function GeneratePlainTextResetPasswordEmail({
  displayName,
  email,
  url,
}: ResetPasswordData): string {
  return `
    Xin Chào ${displayName},
    ThueDO vừa nhận được yêu cầu khôi phục mật khẩu từ bạn. Hãy mở link bên dưới để tiến hành đổi mật khẩu cho tài khoản ${email}.
    
    ${url}
    
    Hãy bỏ qua email này nếu bạn không muốn đổi mật khẩu nữa. Chúc bạn có một ngày tốt lành. 

    ThueDO Team 
    Cần hỗ trợ? Hãy liên hệ với chúng tôi tại địa chỉ email hotro@thuedo.vn (mailto:hotro@thuedo.vn) 
    Xem thêm thông tin tại Blog: https://blog.thuedo.vn 
    
    Theo dõi tại: 
    
    https://www.facebook.com/Thue-Do-105363268055385 
  `;
}

export function GenerateHTMLResetPasswordEmail({
  displayName,
  email,
  url,
}: ResetPasswordData): string {
  return `
  <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
    <title> </title>
    <!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a {
        padding: 0;
      }
  
      body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
  
      table,
      td {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
  
      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }
  
      p {
        display: block;
        margin: 13px 0;
      }
    </style>
    <!--[if mso]>
          <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
    <!--[if lte mso 11]>
          <style type="text/css">
            .mj-outlook-group-fix { width:100% !important; }
          </style>
          <![endif]-->
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
    <style type="text/css">
      @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
    </style>
    <!--<![endif]-->
    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-100 {
          width: 100% !important;
          max-width: 100%;
        }
      }
    </style>
    <style type="text/css">
      @media only screen and (max-width:480px) {
        table.mj-full-width-mobile {
          width: 100% !important;
        }
        td.mj-full-width-mobile {
          width: auto !important;
        }
      }
    </style>
  </head>
  
  <body style="background-color:#fbfbfb;">
    <div style="background-color:#fbfbfb;">
      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
        >
          <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:0;padding-top:25px;text-align:center;">
                <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
          <tr>
        
              <td
                 class="" style="vertical-align:top;width:600px;"
              >
            <![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tr>
                      <td align="center" style="font-size:0px;padding:0;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:600px;"> <img alt="Header image" height="auto" src="https://asia-fast-storage.thuedo.vn/mail-template/mail-header.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="600">                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </table>
                </div>
                <!--[if mso | IE]>
              </td>
            
          </tr>
        
                    </table>
                  <![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]>
            </td>
          </tr>
        </table>
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" class="body-section-outlook" style="width:600px;" width="600"
        >
          <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
      <div class="body-section" style="-webkit-box-shadow: 0 3px 8px 0 rgba(0, 10, 18, 0.1); -moz-box-shadow: 0 3px 8px 0 rgba(0, 10, 18, 0.1); box-shadow: 0 3px 8px 0 rgba(0, 10, 18, 0.1); margin: 0px auto; border-radius: 4px; max-width: 600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;border-radius:4px;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;padding-top:0;text-align:center;">
                <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
              <tr>
                <td
                   class="" width="600px"
                >
            
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
        >
          <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
                <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
                    <tbody>
                      <tr>
                        <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;padding-top:20px;text-align:center;">
                          <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
          <tr>
        
              <td
                 class="" style="vertical-align:top;width:600px;"
              >
            <![endif]-->
                          <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                              <tr>
                                <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                  <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:14px;line-height:22px;text-align:left;color:#000000;">Xin Chào <strong>${displayName}</strong>,</div>
                                </td>
                              </tr>
                              <tr>
                                <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                  <div style="font-family:Arial;font-size:14px;line-height:22px;text-align:left;color:#000000;">ThueDO vừa nhận được yêu cầu khôi phục mật khẩu từ bạn. Hãy click vào nút nhấn bên dưới để tiến hành đổi mật khẩu cho tài khoản <strong>${email}</strong>.</div>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" vertical-align="middle" style="font-size:0px;padding:20px 0 20px 0;word-break:break-word;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                    <tr>
                                      <td align="center" bgcolor="#746DF7" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#746DF7;" valign="middle"> <a href="${url}" style="display:inline-block;background:#746DF7;color:#ffffff;font-family:Arial, sans-serif;font-size:16px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;"
                                          target="_blank">
                Thay Đổi Mật Khẩu
              </a> </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                  <div style="font-family:Arial;font-size:14px;line-height:22px;text-align:center;color:#000000;">Hãy bỏ qua email này nếu bạn không muốn đổi mật khẩu nữa. Chúc bạn có một ngày tốt lành.</div>
                                </td>
                              </tr>
                              <tr>
                                <td style="font-size:0px;padding:10px 25px;padding-right:0;padding-left:0;word-break:break-word;">
                                  <p style="border-top:solid 1px #ebeef2;font-size:1px;margin:0px auto;width:100%;"> </p>
                                  <!--[if mso | IE]>
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #ebeef2;font-size:1px;margin:0px auto;width:600px;" role="presentation" width="600px"
          >
            <tr>
              <td style="height:0;line-height:0;">
                &nbsp;
              </td>
            </tr>
          </table>
        <![endif]-->
                                </td>
                              </tr>
                            </table>
                          </div>
                          <!--[if mso | IE]>
              </td>
            
          </tr>
        
                    </table>
                  <![endif]-->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]>
            </td>
          </tr>
        </table>
        
                </td>
              </tr>
            
              <tr>
                <td
                   class="" width="600px"
                >
            
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
        >
          <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
                <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
                    <tbody>
                      <tr>
                        <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;padding-left:15px;padding-right:15px;padding-top:0;text-align:center;">
                          <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
          <tr>
        
              <td
                 class="" style="vertical-align:top;width:570px;"
              >
            <![endif]-->
                          <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                              <tr>
                                <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                  <div style="font-family:Arial;font-size:14px;line-height:22px;text-align:center;color:#b7b7b7;">ThueDO Team</div>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="font-size:0px;padding:0;word-break:break-word;">
                                  <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:22px;text-align:center;color:#b7b7b7;">Cần hỗ trợ? Hãy liên hệ với chúng tôi tại địa chỉ email <a href="mailto:hotro@thuedo.vn" style="color: #746DF7; text-decoration: none">hotro@thuedo.vn</a></div>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="font-size:0px;padding:0;word-break:break-word;">
                                  <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:22px;text-align:center;color:#b7b7b7;">Xem thêm thông tin tại Blog: <a href="https://blog.thuedo.vn" style="color: #746DF7; text-decoration: none">https://blog.thuedo.vn</a></div>
                                </td>
                              </tr>
                            </table>
                          </div>
                          <!--[if mso | IE]>
              </td>
            
              <td
                 class="" style="vertical-align:top;width:570px;"
              >
            <![endif]-->
                          <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                              <tr>
                                <td align="center" style="font-size:0px;padding:0;word-break:break-word;">
                                  <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:22px;text-align:center;color:#b7b7b7;">Theo dõi tại:</div>
                                </td>
                              </tr>
                            </table>
                          </div>
                          <!--[if mso | IE]>
              </td>
            
          </tr>
        
                    </table>
                  <![endif]-->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]>
            </td>
          </tr>
        </table>
        
                </td>
              </tr>
            
              <tr>
                <td
                   class="" width="600px"
                >
            
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
        >
          <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
                <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;border-radius:4px;max-width:600px;">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;border-radius:4px;">
                    <tbody>
                      <tr>
                        <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:15px;padding-left:15px;padding-right:15px;padding-top:0;text-align:center;">
                          <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
          <tr>
        
              <td
                 class="" style="vertical-align:middle;width:570px;"
              >
            <![endif]-->
                          <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                              <tr>
                                <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                  <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:14px;line-height:22px;text-align:center;color:#000000;"><a href="https://www.facebook.com/Thue-Do-105363268055385" style="text-decoration: none; color: inherit;">
              <img width="20px" src="https://asia-fast-storage.thuedo.vn/mail-template/facebook-icon.png" alt="Facebook icon">
            </a></div>
                                </td>
                              </tr>
                            </table>
                          </div>
                          <!--[if mso | IE]>
              </td>
            
          </tr>
        
                    </table>
                  <![endif]-->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]>
            </td>
          </tr>
        </table>
        
                </td>
              </tr>
            
                    </table>
                  <![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]>
            </td>
          </tr>
        </table>
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
        >
          <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:25px;text-align:center;">
                <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
          <tr>
        
          </tr>
        
                    </table>
                  <![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]>
            </td>
          </tr>
        </table>
        <![endif]-->
    </div>
  </body>
  
  </html>
  `;
}
