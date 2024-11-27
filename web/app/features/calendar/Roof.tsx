type RoofProps = {
  smallScreen: boolean
}
export const Roof = ({ smallScreen }: RoofProps) => {
  return smallScreen ? smallRoof : largeRoof
}

const smallRoof = (
  <svg width="440" height="117" viewBox="0 0 440 117" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M216.962 26.0992L25.8916 111.865H408.033L216.962 26.0992Z" fill="#5A3C26" />
    <path
      d="M252.109 45.2809C251.592 45.7198 249.182 45.8132 248.103 45.9327C232.493 47.6543 204.828 48.9085 196.182 55.9403C190.598 60.4845 200.988 61.9802 208.691 62.9591C216.738 63.9822 228.095 65.1767 236.33 65.5195C237.107 65.5506 249.268 65.2806 245.241 66.4387C244.126 66.7607 232.315 66.392 230.014 66.2985C220.648 65.922 203.483 64.7872 196.147 62.1438C185.53 58.3137 196.137 52.7594 204.649 50.4275C217.833 46.8182 236.852 45.1719 252.111 45.2835L252.109 45.2809Z"
      fill="#442E1A"
    />
    <path
      d="M332.49 86.0229C333.424 86.4825 329.558 88.0613 328.748 88.3522C310.735 94.8023 269.041 91.1644 247.228 90.175C243.162 89.9907 238.98 89.905 234.89 89.9128C233.957 89.5934 234.9 89.4428 235.738 89.3934C240.214 89.1364 248.234 89.3051 252.996 89.383C272.916 89.705 294.6 91.5227 314.117 89.0039C316.494 88.6975 331.829 85.6957 332.489 86.0229H332.49Z"
      fill="#442E1A"
    />
    <path
      d="M236.231 37.0804C236.543 37.8231 235.784 37.4985 234.976 37.6673C219.873 40.843 200.507 40.1419 184.561 42.266C199.04 37.1324 218.932 38.1632 236.231 37.0804Z"
      fill="#442E1A"
    />
    <path
      d="M241.2 47.6156C241.379 48.205 241.05 48.4361 240.014 48.7633C235.518 50.1863 225.667 50.5135 219.659 52.2792C200.659 57.8647 223.063 61.996 234.864 63.2009C235.434 64.1357 233.739 64.2292 231.909 64.1694C226.63 63.9903 212.052 60.8561 210.905 58.3269C209.086 54.315 215.379 52.2143 222.445 50.6875C228.375 49.4047 235.05 48.6621 241.2 47.6182V47.6156Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M26.6235 111.536C28.7431 111.415 30.861 111.287 32.9772 111.151C68.9335 108.843 103.836 104.293 138.647 99.7554C146.844 98.6868 155.037 97.6189 163.237 96.581C163.359 96.5659 163.505 96.5544 163.659 96.5423C164.247 96.4961 164.946 96.4412 164.838 96.1447H164.84C164.839 96.1448 164.839 96.1447 164.838 96.1447C155.791 96.4614 146.726 97.3035 137.795 98.1331C137.205 98.188 136.615 98.2428 136.025 98.2974C119.396 99.8381 102.866 101.683 86.3269 103.53C68.22 105.551 50.1024 107.573 31.8316 109.199L26.6235 111.536Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M44.4717 103.525C67.2527 102.745 89.6135 100.016 111.949 97.2898C140.737 93.7764 169.483 90.2682 199.031 90.9438C203.693 91.0503 210.299 91.3774 214.812 91.8552C215.501 91.9281 216.819 92.1445 218.426 92.4083C223.12 93.1793 230.279 94.3549 231.416 93.5327C231.515 93.46 231.497 92.803 231.444 92.7745H231.445C231.403 92.7516 231.012 92.7191 230.51 92.6775C229.814 92.6198 228.906 92.5445 228.418 92.4525C198.961 86.8748 175.27 88.2562 144.739 91.3411C131.664 92.6625 118.774 94.2255 105.887 95.7881C86.7758 98.1055 67.6724 100.422 47.9861 101.948L44.4717 103.525Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M61.0537 96.0819C72.1631 94.9334 83.2639 93.8358 94.1094 92.8469C101.809 92.1456 109.773 91.6099 117.748 91.0735C128.641 90.3409 139.553 89.607 149.83 88.4481C151.975 88.2066 153.157 88.0067 151.654 86.9109C142.899 87.2796 133.881 87.9911 125.117 88.6974C105.591 90.2723 85.5509 92.0967 65.6451 94.0209L61.0537 96.0819Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M81.2969 86.995C81.7407 86.9572 82.1845 86.9197 82.6285 86.8823C103.488 85.1292 124.734 84.0877 145.806 83.0548C146.706 83.0107 147.606 82.9666 148.506 82.9224C150.782 82.8107 151.417 82.1979 149.032 81.8629C142.118 81.9537 135.326 82.495 128.542 83.0357C124.45 83.3618 120.361 83.6877 116.251 83.9143C111.715 84.1639 107.141 84.2695 102.571 84.3751C98.7251 84.4639 94.8819 84.5527 91.0661 84.7271C89.2801 84.809 87.5019 84.902 85.7304 85.0049L81.2969 86.995Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M98.8916 79.0978C120.113 78.6716 141.675 78.8691 160.952 80.1234C170.578 80.7499 179.763 82.1686 188.9 83.5799C202.561 85.6899 216.116 87.7834 230.876 87.189C230.898 86.8163 227.588 86.8004 225.426 86.7899C224.666 86.7863 224.048 86.7833 223.766 86.7657C213.26 86.1234 203.975 84.4302 194.609 82.722C189.739 81.8338 184.846 80.9416 179.748 80.1909C159.451 77.2013 131.005 76.5275 103.668 76.9539L98.8916 79.0978Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M114.778 111.865C117.519 111.584 120.256 111.287 122.985 110.991C130.644 110.159 138.239 109.334 145.688 108.897C152.462 108.499 160.689 108.363 169.25 108.221C184.94 107.962 201.749 107.684 212.776 105.742C212.868 105.726 212.958 105.711 213.047 105.696C213.815 105.569 214.415 105.469 214.216 104.968L214.214 104.971C201.049 106.504 187.603 106.474 174.167 106.444C168.649 106.432 163.133 106.42 157.639 106.516C145.405 106.73 133.468 107.723 121.541 108.715C107.683 109.869 93.8375 111.021 79.554 110.948L65.2261 110.416C64.3484 111.052 66.0703 111.531 67.9166 111.865H114.778Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M229.327 111.865C243.834 109.532 257.513 107.452 276.939 107.881C283.66 108.03 291.181 108.718 298.833 109.419C311.405 110.571 324.33 111.754 334.636 110.626C335.482 110.533 345.573 108.852 343.801 108.154C329.286 109.042 315.317 107.885 301.297 106.724C288.945 105.701 276.554 104.674 263.716 105.041C249.451 105.448 235.812 107.721 222.167 109.995C218.345 110.632 214.522 111.269 210.685 111.865H229.327Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M405.609 110.777C401.405 111.211 395.937 110.528 390.427 109.839C383.699 108.997 376.907 108.148 372.274 109.317C372.103 109.361 371.953 109.381 371.831 109.397C371.488 109.443 371.358 109.46 371.541 109.897V109.894C376.43 109.596 381.916 110.32 387.448 111.049C389.668 111.342 391.896 111.636 394.095 111.865H407.129C407.345 111.829 407.56 111.79 407.774 111.748L405.609 110.777Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M392.064 104.697C391.041 104.572 390.038 104.477 389.071 104.439C373.888 103.838 361.304 106.862 348.731 109.882C345.924 110.557 343.117 111.231 340.282 111.865H352.408C352.991 111.738 353.571 111.612 354.15 111.485C364.886 109.139 375.204 106.884 389.074 107.292C390.837 107.344 393.067 107.552 395.383 107.769C396.839 107.905 398.328 108.045 399.757 108.15L392.064 104.697Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M375.619 97.3157C369.883 97.9855 364.145 98.6531 358.343 99.1335C346.995 100.074 333.977 100.645 322.452 100.294C318.247 100.167 313.957 99.8156 309.644 99.4629C303.786 98.9838 297.887 98.5013 292.103 98.5701C291.591 98.5779 290.131 98.7077 290.584 99.1257C290.916 99.4322 297.929 100.967 299.201 101.201C314.055 103.937 331.784 103.885 347.317 102.455C355.397 101.71 363.34 100.609 371.288 99.5077C373.639 99.182 375.99 98.8561 378.345 98.5394L375.619 97.3157Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M367.357 93.6071C366.623 93.9548 365.908 94.3233 365.214 94.714C365.624 95.0481 366.428 94.8207 366.994 94.6605C367.084 94.6351 367.167 94.6115 367.242 94.592C367.736 94.4634 368.228 94.3385 368.717 94.2174L367.357 93.6071Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M356.01 88.5134C321.408 94.3966 286.221 97.0297 248.978 97.4536C244.843 97.5002 239.019 97.4341 232.463 97.3596C214.213 97.1523 190.291 96.8806 181.335 98.7987C181.324 98.8011 181.312 98.8035 181.3 98.8061C180.498 98.9777 178.058 99.4999 179.197 100.035C179.419 100.139 182.076 99.792 184.856 99.429C187.335 99.1053 189.911 98.7689 190.944 98.7286C195.832 98.5399 200.658 98.7539 205.472 98.9675C208.476 99.1007 211.475 99.2338 214.482 99.2687C259.334 99.7906 301.226 98.7338 343.952 92.3693C349.032 91.6121 354.141 90.8129 359.244 89.9653L356.01 88.5134Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M261.674 46.1694C257.681 46.9883 253.846 47.9112 250.213 48.9601C242.012 51.3283 233.898 55.2597 236.427 60.0194C237.831 62.6603 245.35 64.4364 250.812 64.9376C266.511 66.3798 284.287 65.8256 302.004 64.2721L297.706 62.343C281.893 62.6716 259.58 62.6009 247.525 60.975C230.861 58.7289 245.406 51.8866 254.128 49.695C247.866 54.743 246.87 60.3856 262.734 61.1074H262.731C264.222 61.1759 265.815 61.1462 267.409 61.1165C268.84 61.0899 270.272 61.0632 271.631 61.1074C271.665 60.8472 271.703 60.7251 271.658 60.6665C271.597 60.5859 271.378 60.6253 270.774 60.5907C261.071 60.0324 248.226 59.2612 253.396 53.2551C255.441 50.8795 259.725 49.0719 265 47.6624L261.674 46.1694Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M252.216 41.9236C219.731 44.947 187.48 48.4087 159.148 56.8491C159.013 56.8891 158.788 56.9508 158.501 57.0293C156.648 57.5371 152.237 58.7457 153.361 59.29C155.64 58.779 157.913 58.264 160.187 57.7492C170.967 55.3077 181.739 52.8683 192.984 50.8611C214.274 47.0596 234.219 45.0101 254.866 43.1131L252.216 41.9236ZM280.86 54.781C280.984 55.4224 282.219 56.0713 285.134 56.6995L291.11 59.3821C283.306 58.5045 275.506 56.3946 278.084 53.5348L280.86 54.781Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M313.224 69.3083C285.248 70.7377 254.619 69.1475 226.456 67.6853C218.606 67.2777 210.947 66.8801 203.591 66.5605C196.63 66.2585 189.596 65.9294 182.529 65.5989C166.163 64.8332 149.625 64.0595 133.427 63.5956L127.196 66.3924C128.928 66.4384 130.661 66.4931 132.396 66.5579C145.391 67.0431 158.269 67.6374 171.134 68.2309C193.108 69.2449 215.042 70.2569 237.446 70.7204C238.53 70.7429 239.609 70.7654 240.681 70.7877C267.974 71.3566 291.667 71.8505 315.237 70.2121L313.224 69.3083Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M320.728 72.6764C288.753 76.1522 253.364 77.5343 226.533 76.9555C208.885 76.5748 198.232 74.884 183.573 72.5573C181.632 72.2492 179.62 71.9299 177.513 71.6011C177.484 71.5965 177.454 71.5919 177.425 71.5872C176.756 71.482 175.947 71.3544 176.318 71.8789C176.468 72.0919 183.982 73.6499 185.121 73.8732C217.616 80.2481 268.815 79.6326 303.316 76.8594C310.757 76.2618 318.059 75.5476 325.194 74.6813L320.728 72.6764Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M334.729 78.9614C303.386 83.3335 272.585 84.3213 239.771 83.1638C239.547 83.1562 238.899 83.1134 238.014 83.0551C234.685 82.8355 228.011 82.3953 227.992 82.7769C264.142 88.1235 302.807 85.768 338.539 80.6714L334.729 78.9614Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.9541 29.8947L25.8921 30.1309L25.8928 30.1306C26.5795 30.052 27.266 29.9733 27.9526 29.8946C43.4075 28.124 58.8591 26.3537 74.4115 24.8958L74.4119 24.896C58.8598 26.3539 43.4086 28.1241 27.9541 29.8947Z"
      fill="#442E1A"
    />
    <path
      d="M15.8952 116.988L25.8999 111.939L216.971 26.3854V8.97628L8.41504 103.524L15.8952 116.988Z"
      fill="#382A21"
    />
    <path
      d="M216.923 8.97628V26.3854L407.994 111.939L417.999 116.988L425.479 103.524L216.923 8.97628Z"
      fill="#382A21"
    />
    <path
      d="M439.999 95.5577V98.517C438.972 100.862 438.401 103.224 436.144 104.732C430.155 108.734 422.856 105.087 417.916 101.172C415.265 99.0724 412.739 95.6063 409.864 94.1149C403.387 90.7526 397.178 92.1458 390.4 89.5698C375.08 83.7465 366.349 72.0728 348.435 68.4179C338.349 66.3599 334.128 65.5679 325.27 59.8718C316.946 54.5198 308.888 48.9302 300.239 44.013C289.957 38.1663 277.896 35.5371 266.839 31.1808C252.199 25.4136 236.846 15.6175 221.517 13.0826C209.114 11.0321 204.097 14.9948 192.995 18.1682C185.352 20.3524 177.629 21.279 170.09 24.0149C157.183 28.6984 146.682 37.6801 134.187 43.2276C119.333 49.8223 105.549 51.0284 91.7876 60.9873C84.2692 66.4282 78.3524 73.9522 70.1373 78.4441C56.357 85.9784 40.3842 84.4759 27.3949 94.6788C20.343 100.218 14.6469 110.274 4.70299 110.06C-0.35639 107.163 -0.721046 101.424 0.764695 96.215C3.82126 85.4997 20.1682 73.3314 30.2084 69.3716C37.3669 66.5488 45.0966 65.6755 52.4421 63.4473C72.1233 57.4763 86.7759 42.516 104.625 32.9602C117.211 26.2224 126.943 24.4581 140.279 20.6011C169.367 12.185 189.213 -4.71166 221.812 1.24533C246.317 5.72312 259.912 19.3585 281.363 28.2262C295.172 33.9354 309.567 38.4253 323.073 44.8985C332.797 49.5586 341.492 56.0598 351.435 60.6881C363.475 66.2926 374.685 69.0518 387.344 72.4964C399.183 75.7175 407.977 82.1486 419.781 84.8096C427.451 86.5385 436.861 86.7779 440 95.5567L439.999 95.5577Z"
      fill="white"
    />
    <path
      d="M436.145 104.732C433.335 112.587 425.152 111.729 418.654 109.315C408.831 105.664 400.909 98.2916 391.067 94.2308C387.361 92.7021 381.796 90.7124 377.96 89.5557C371.266 87.5352 364.748 88.1345 358.906 83.4174C356.663 81.6062 355.711 79.1023 353.714 77.3538C348.286 72.6048 341.816 73.1827 335.326 71.4379C324.542 68.5384 319.164 63.8849 310.096 58.4421C301.596 53.3397 292.144 53.0415 283.618 48.7628C275.454 44.6656 268.379 37.1957 258.877 34.9835C248.385 32.5403 241.984 32.4309 232.635 25.9559C227.934 22.6992 224.705 17.7698 218.333 18.0101C210.584 18.3028 202.008 26.6712 194.171 29.7016C189.111 31.6576 184.173 31.8203 179.573 33.4809C174.227 35.4127 169.183 39.5342 163.641 41.2556C161.204 42.013 158.585 42.1831 156.161 42.9639C148.995 45.2734 143.987 53.1069 136.855 56.2486C123.954 61.9307 112.061 60.9882 99.0215 69.0957C87.6816 76.1467 76.1314 85.0284 62.8242 88.3103C56.7223 89.8157 51.1206 88.747 45.2141 91.4501C33.8116 96.6684 19.2066 118.364 4.70264 110.059C14.6475 110.273 20.3427 100.217 27.3946 94.6778C40.3838 84.4749 56.3567 85.9774 70.137 78.4431C78.352 73.9513 84.2688 66.4272 91.7873 60.9863C105.549 51.0275 119.334 49.8213 134.187 43.2266C146.682 37.6791 157.182 28.6974 170.089 24.0139C177.628 21.278 185.352 20.3514 192.994 18.1672C204.097 14.9947 209.114 11.0312 221.516 13.0817C236.847 15.6165 252.199 25.4127 266.838 31.1798C277.896 35.5361 289.957 38.1644 300.239 44.012C308.888 48.9293 316.946 54.5188 325.269 59.8708C334.129 65.567 338.349 66.3589 348.434 68.4169C366.349 72.0719 375.081 83.7465 390.4 89.5688C397.178 92.1448 403.387 90.7516 409.864 94.114C412.738 95.6062 415.265 99.0714 417.916 101.171C422.856 105.086 430.155 108.733 436.144 104.731L436.145 104.732Z"
      fill="#C1DDE5"
    />
  </svg>
)

const largeRoof = (
  <svg width="1326" height="353" viewBox="0 0 1326 353" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M653.611 78.6251L78 337H1229.22L653.611 78.6251Z" fill="#5A3C26" />
    <path
      d="M759.494 136.411C757.935 137.733 750.674 138.015 747.425 138.375C700.398 143.561 617.057 147.339 591.01 168.523C574.187 182.213 605.489 186.719 628.695 189.668C652.937 192.75 687.149 196.348 711.958 197.381C714.298 197.475 750.933 196.661 738.803 200.15C735.445 201.12 699.863 200.009 692.931 199.728C664.716 198.594 613.005 195.175 590.905 187.212C558.918 175.673 590.874 158.94 616.517 151.916C656.234 141.042 713.529 136.083 759.498 136.419L759.494 136.411Z"
      fill="#442E1A"
    />
    <path
      d="M1001.65 259.149C1004.46 260.534 992.812 265.29 990.372 266.166C936.105 285.597 810.5 274.638 744.789 271.657C732.54 271.102 719.941 270.844 707.618 270.867C704.808 269.905 707.648 269.451 710.173 269.303C723.659 268.528 747.818 269.037 762.165 269.271C822.173 270.241 887.498 275.717 946.295 268.129C953.455 267.206 999.652 258.163 1001.64 259.149H1001.65Z"
      fill="#442E1A"
    />
    <path
      d="M711.66 111.707C712.6 113.944 710.312 112.966 707.88 113.475C662.381 123.042 604.041 120.93 556 127.329C599.62 111.863 659.545 114.969 711.66 111.707Z"
      fill="#442E1A"
    />
    <path
      d="M726.629 143.445C727.169 145.22 726.177 145.917 723.056 146.902C709.512 151.189 679.835 152.175 661.735 157.494C604.496 174.321 671.99 186.766 707.541 190.396C709.258 193.212 704.152 193.494 698.638 193.314C682.737 192.774 638.818 183.332 635.363 175.713C629.884 163.627 648.841 157.298 670.129 152.699C687.992 148.834 708.103 146.597 726.629 143.452V143.445Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M80.2056 336.01C86.5907 335.645 92.9711 335.258 99.3464 334.849C207.667 327.897 312.812 314.19 417.682 300.519C442.378 297.3 467.058 294.082 491.761 290.956C492.129 290.91 492.57 290.876 493.033 290.839C494.805 290.7 496.909 290.535 496.586 289.642C496.587 289.642 496.588 289.642 496.59 289.642H496.585C496.585 289.642 496.586 289.642 496.586 289.642C469.331 290.596 442.022 293.132 415.116 295.632C413.337 295.797 411.56 295.962 409.784 296.127C359.686 300.768 309.889 306.327 260.065 311.889C205.517 317.978 150.937 324.071 95.8951 328.967L80.2056 336.01Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M133.972 311.876C202.601 309.524 269.965 301.303 337.25 293.091C423.977 282.506 510.576 271.938 599.591 273.973C613.635 274.294 633.535 275.28 647.131 276.719C649.208 276.938 653.179 277.59 658.018 278.385C672.161 280.708 693.727 284.249 697.152 281.772C697.451 281.553 697.398 279.574 697.235 279.488H697.24C697.115 279.419 695.936 279.321 694.422 279.196C692.327 279.022 689.59 278.795 688.122 278.518C599.38 261.715 528.01 265.877 436.033 275.17C396.644 279.151 357.811 283.86 318.989 288.567C261.416 295.548 203.865 302.526 144.56 307.124L133.972 311.876Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M183.928 289.452C217.396 285.992 250.837 282.686 283.51 279.707C306.704 277.594 330.699 275.98 354.723 274.364C387.539 272.157 420.411 269.946 451.371 266.455C457.833 265.728 461.393 265.125 456.867 261.824C430.491 262.935 403.325 265.078 376.923 267.206C318.098 271.95 257.727 277.447 197.76 283.244L183.928 289.452Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M244.913 262.078C246.25 261.964 247.587 261.851 248.925 261.738C311.767 256.457 375.771 253.319 439.25 250.207C441.963 250.075 444.674 249.942 447.384 249.809C454.242 249.472 456.156 247.626 448.969 246.617C428.14 246.89 407.678 248.521 387.241 250.15C374.915 251.132 362.597 252.114 350.214 252.797C336.549 253.549 322.77 253.867 309.002 254.185C297.417 254.452 285.839 254.72 274.344 255.245C268.963 255.492 263.606 255.772 258.269 256.082L244.913 262.078Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M297.915 238.287C361.845 237.003 426.803 237.598 484.876 241.376C513.873 243.264 541.544 247.538 569.072 251.789C610.226 258.146 651.059 264.452 695.526 262.662C695.591 261.539 685.621 261.491 679.108 261.46C676.818 261.449 674.956 261.44 674.107 261.387C642.455 259.452 614.485 254.351 586.269 249.205C571.596 246.529 556.857 243.841 541.499 241.58C480.353 232.573 394.658 230.543 312.303 231.828L297.915 238.287Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M345.775 337C354.032 336.154 362.277 335.259 370.498 334.366C393.57 331.861 416.451 329.376 438.891 328.058C459.298 326.86 484.084 326.45 509.873 326.023C557.142 325.242 607.78 324.405 640.999 318.554C641.275 318.505 641.548 318.46 641.814 318.416C644.128 318.031 645.935 317.731 645.336 316.223L645.332 316.23C605.671 320.85 565.164 320.76 524.686 320.67C508.064 320.633 491.446 320.596 474.895 320.885C438.04 321.529 402.079 324.522 366.146 327.512C324.399 330.986 282.689 334.457 239.659 334.238L196.496 332.635C193.852 334.549 199.038 335.994 204.601 337H345.775Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M690.861 337C734.562 329.972 775.773 323.706 834.293 324.999C854.541 325.445 877.199 327.521 900.251 329.632C938.125 333.1 977.062 336.666 1008.11 333.267C1010.66 332.985 1041.06 327.924 1035.72 325.82C991.991 328.494 949.909 325.009 907.675 321.511C870.463 318.429 833.134 315.338 794.457 316.441C751.483 317.667 710.396 324.515 669.291 331.365C657.776 333.285 646.259 335.204 634.7 337H690.861Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1221.92 333.721C1209.25 335.031 1192.78 332.971 1176.18 330.895C1155.91 328.36 1135.45 325.801 1121.5 329.325C1120.98 329.457 1120.53 329.516 1120.16 329.565C1119.13 329.702 1118.73 329.755 1119.29 331.069V331.062C1134.02 330.164 1150.54 332.344 1167.21 334.542C1173.9 335.424 1180.61 336.309 1187.23 337H1226.5C1227.15 336.89 1227.8 336.773 1228.44 336.648L1221.92 333.721Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1181.12 315.406C1178.03 315.029 1175.01 314.742 1172.1 314.627C1126.36 312.818 1088.45 321.926 1050.57 331.027C1042.12 333.059 1033.66 335.091 1025.12 337H1061.65C1063.4 336.618 1065.15 336.236 1066.9 335.855C1099.24 328.788 1130.32 321.996 1172.11 323.224C1177.42 323.379 1184.14 324.008 1191.11 324.661C1195.5 325.071 1199.99 325.491 1204.29 325.809L1181.12 315.406Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1131.57 293.169C1114.29 295.187 1097.01 297.198 1079.53 298.646C1045.34 301.477 1006.13 303.198 971.405 302.142C958.737 301.757 945.813 300.7 932.821 299.638C915.174 298.194 897.401 296.741 879.976 296.948C878.435 296.972 874.036 297.363 875.402 298.622C876.403 299.545 897.528 304.168 901.361 304.872C946.109 313.117 999.519 312.961 1046.31 308.651C1070.66 306.408 1094.58 303.092 1118.53 299.773C1125.61 298.791 1132.69 297.81 1139.79 296.856L1131.57 293.169Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1106.69 281.997C1104.47 283.044 1102.32 284.154 1100.23 285.331C1101.46 286.338 1103.88 285.653 1105.59 285.17C1105.86 285.094 1106.11 285.022 1106.34 284.964C1107.83 284.576 1109.31 284.2 1110.78 283.835L1106.69 281.997Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1072.5 266.651C968.258 284.375 862.255 292.307 750.06 293.584C737.602 293.725 720.057 293.525 700.307 293.301C645.328 292.677 573.262 291.858 546.28 297.636C546.247 297.643 546.212 297.651 546.176 297.659C543.76 298.176 536.409 299.749 539.84 301.36C540.508 301.674 548.514 300.629 556.888 299.535C564.356 298.56 572.116 297.547 575.229 297.425C589.954 296.857 604.492 297.501 618.995 298.145C628.044 298.546 637.079 298.947 646.138 299.052C781.256 300.625 907.459 297.441 1036.17 278.267C1051.48 275.986 1066.87 273.579 1082.24 271.025L1072.5 266.651Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M788.312 139.088C776.282 141.555 764.727 144.335 753.784 147.495C729.076 154.63 704.632 166.473 712.253 180.812C716.481 188.768 739.134 194.118 755.588 195.628C802.882 199.973 856.432 198.303 909.806 193.623L896.859 187.812C849.221 188.802 782.002 188.589 745.684 183.691C695.483 176.924 739.301 156.311 765.576 149.709C746.711 164.916 743.713 181.915 791.504 184.09H791.495C795.986 184.296 800.785 184.206 805.588 184.117C809.898 184.037 814.21 183.957 818.305 184.09C818.407 183.306 818.522 182.938 818.388 182.761C818.202 182.518 817.543 182.637 815.724 182.533C786.494 180.851 747.796 178.528 763.372 160.434C769.532 153.277 782.439 147.832 798.331 143.586L788.312 139.088Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M759.816 126.297C661.952 135.405 564.796 145.834 479.442 171.261C479.037 171.381 478.358 171.567 477.495 171.804C471.912 173.334 458.625 176.974 462.009 178.614C468.874 177.075 475.724 175.523 482.572 173.972C515.05 166.617 547.499 159.269 581.376 153.222C645.512 141.769 705.599 135.595 767.799 129.881L759.816 126.297ZM846.107 165.031C846.481 166.963 850.202 168.918 858.983 170.81L876.987 178.892C853.478 176.248 829.979 169.892 837.744 161.276L846.107 165.031Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M943.606 208.795C859.326 213.101 767.055 208.311 682.211 203.906C658.563 202.678 635.491 201.48 613.331 200.517C592.36 199.608 571.169 198.616 549.881 197.62C500.576 195.314 450.755 192.983 401.957 191.585L383.187 200.011C388.403 200.149 393.625 200.314 398.852 200.51C437.999 201.971 476.796 203.761 515.551 205.55C581.75 208.604 647.827 211.653 715.322 213.049C718.587 213.117 721.836 213.185 725.067 213.252C807.287 214.966 878.666 216.453 949.672 211.518L943.606 208.795Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M966.21 218.942C869.885 229.413 763.274 233.576 682.443 231.833C629.277 230.686 597.185 225.592 553.023 218.583C547.175 217.655 541.116 216.693 534.768 215.702C534.68 215.689 534.591 215.675 534.502 215.66C532.489 215.343 530.05 214.959 531.168 216.539C531.62 217.181 554.256 221.874 557.689 222.547C655.58 241.752 809.822 239.898 913.758 231.543C936.172 229.743 958.171 227.591 979.666 224.982L966.21 218.942Z"
      fill="#442E1A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1008.39 237.876C913.969 251.047 821.18 254.023 722.325 250.536C721.649 250.513 719.696 250.384 717.032 250.208C707.004 249.547 686.895 248.22 686.84 249.37C795.744 265.477 912.223 258.381 1019.87 243.027L1008.39 237.876Z"
      fill="#442E1A"
    />
    <path
      d="M47.8869 352.434L78.0266 337.224L653.638 79.4871V27.0413L25.3525 311.872L47.8869 352.434Z"
      fill="#382A21"
    />
    <path
      d="M653.496 27.0413V79.4871L1229.11 337.224L1259.25 352.434L1281.78 311.872L653.496 27.0413Z"
      fill="#382A21"
    />
    <path
      d="M1325.52 287.873V296.788C1322.43 303.853 1320.71 310.968 1313.91 315.511C1295.87 327.567 1273.88 316.582 1259 304.788C1251.01 298.461 1243.4 288.019 1234.74 283.527C1215.23 273.397 1196.52 277.595 1176.1 269.834C1129.95 252.291 1103.65 217.124 1049.68 206.113C1019.3 199.913 1006.58 197.527 979.894 180.367C954.819 164.244 930.544 147.405 904.488 132.592C873.512 114.978 837.178 107.057 803.867 93.934C759.764 76.5601 713.513 47.0485 667.331 39.4122C629.967 33.235 614.855 45.1726 581.408 54.7327C558.384 61.3128 535.117 64.1042 512.405 72.3461C473.522 86.4555 441.887 113.514 404.246 130.226C359.498 150.092 317.973 153.726 276.516 183.728C253.866 200.119 236.041 222.785 211.293 236.317C169.779 259.015 121.66 254.488 82.5287 285.225C61.2845 301.912 44.1246 332.206 14.168 331.561C-1.07365 322.835 -2.17219 305.546 2.30369 289.853C11.5118 257.573 60.7578 220.915 91.0045 208.986C112.57 200.482 135.856 197.851 157.985 191.139C217.276 173.151 261.418 128.082 315.19 99.2944C353.104 78.9966 382.424 73.6813 422.597 62.062C510.228 36.7081 570.014 -14.1942 668.221 3.75162C742.044 17.2412 783 58.3185 847.623 85.033C889.221 102.232 932.589 115.759 973.277 135.259C1002.57 149.298 1028.77 168.883 1058.72 182.826C1094.99 199.71 1128.76 208.023 1166.9 218.4C1202.56 228.103 1229.05 247.477 1264.62 255.494C1287.72 260.702 1316.07 261.423 1325.53 287.87L1325.52 287.873Z"
      fill="white"
    />
    <path
      d="M1313.91 315.511C1305.45 339.175 1280.79 336.589 1261.22 329.316C1231.63 318.32 1207.76 296.109 1178.11 283.876C1166.95 279.27 1150.18 273.276 1138.63 269.792C1118.46 263.705 1098.82 265.51 1081.22 251.3C1074.47 245.844 1071.6 238.3 1065.58 233.033C1049.23 218.726 1029.74 220.467 1010.19 215.211C977.701 206.476 961.499 192.457 934.182 176.06C908.574 160.689 880.099 159.791 854.416 146.901C829.82 134.558 808.508 112.054 779.881 105.39C748.274 98.0296 728.99 97.7 700.828 78.1937C686.665 68.3828 676.936 53.5327 657.742 54.2566C634.396 55.1383 608.561 80.3486 584.95 89.4778C569.709 95.3705 554.83 95.8606 540.975 100.863C524.868 106.683 509.674 119.099 492.979 124.285C485.636 126.566 477.746 127.079 470.445 129.431C448.857 136.389 433.77 159.988 412.284 169.452C373.418 186.57 337.591 183.73 298.308 208.155C264.146 229.396 229.35 256.153 189.262 266.04C170.879 270.575 154.004 267.355 136.21 275.499C101.859 291.219 57.8611 356.577 14.167 331.559C44.1264 332.204 61.2835 301.909 82.5277 285.222C121.659 254.485 169.778 259.012 211.292 236.314C236.04 222.782 253.865 200.116 276.515 183.725C317.972 153.723 359.5 150.09 404.245 130.223C441.888 113.511 473.521 86.4525 512.404 72.3432C535.116 64.1013 558.382 61.3099 581.407 54.7298C614.854 45.1725 629.968 33.2321 667.33 39.4093C713.514 47.0456 759.763 76.5572 803.866 93.9311C837.177 107.055 873.511 114.973 904.487 132.589C930.543 147.402 954.818 164.241 979.893 180.364C1006.58 197.524 1019.3 199.91 1049.68 206.11C1103.65 217.121 1129.95 252.291 1176.1 269.831C1196.52 277.592 1215.23 273.395 1234.74 283.524C1243.4 288.019 1251.01 298.458 1258.99 304.785C1273.88 316.579 1295.87 327.564 1313.91 315.508L1313.91 315.511Z"
      fill="#C1DDE5"
    />
  </svg>
)
