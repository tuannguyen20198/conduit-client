declare namespace BOTS {
  export interface IBOTSResponseBase<P = any> {
    status?: number | string
    errorCode?: string | null
    message?: string | null
    data: P
  }

  export interface IBotDocument {
    media_id: number
    media_path: string
    title: string
    type: string
  }

  export interface IBOTLIST {
    bot_avatar: any
    bot_id: string
    bot_name: string
    bot_prompt: string
    bot_description: string
    documents: IBotDocument[];
  }

  export interface ICreateGPTChatBot extends Omit<IBOTLIST, 'documents' | 'bot_id'> {
    bot_greetings: string;
  }

  export interface IEditGPTChatBot extends Omit<IBOTLIST, 'documents'> {
    bot_greetings: string;
  }
  
  export interface IGetListGPTBotsResponse extends IBOTSResponseBase<IBOTLIST> {}

}
