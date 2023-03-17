interface messageInterface {
    from: string,
    to: string,
    subject: string,
    html: string,
    attachments?: any[]
}

export default messageInterface;