const {useAsync} = require("./index");
const linkedIn = require('linkedin-jobs-api');

exports.jobs = async (keyword = '', location = '', dateSincePosted = '', jobType = '', remoteFilter = '', salary = '', experienceLevel = '', limit = '25') => {
    const queryOptions = {
        keyword,
        location,
        dateSincePosted,
        jobType,
        remoteFilter,
        salary,
        experienceLevel,
        limit
    };
    let jobs = await linkedIn.query(queryOptions);

    jobs = jobs.map((job, index) => {
        return {
            id: +index + 1,
            jobType: jobType || "All",
            experienceLevel: experienceLevel || "All",
            isUnifaires: false,
            organizationName: 'LinkedIn',
            aboutOrganization: 'LinkedIn is a business and employment-focused social media platform that works through websites and mobile apps. It was launched on May 5, 2003. It is now owned by Microsoft.',
            organizationLogo: 'https://i.im.ge/2023/07/17/55KJSK.1656958733linkedin-logo-png.png',
            ...job
        }
    })
    return jobs
}

exports.courses = useAsync(async (req, res) => {

})

exports.search = useAsync(async (req, res) => {

})