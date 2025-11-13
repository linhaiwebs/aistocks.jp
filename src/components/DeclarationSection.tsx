interface Declaration {
  title: string;
  content: string;
  bookmarkColor: string;
}

export default function DeclarationSection() {
  const declarations: Declaration[] = [
    {
      title: 'サービスの性質',
      content: '本サービスは、AI技術を活用した株式情報の提供および分析ツールです。投資助言業務、投資一任業務、金融商品仲介業務には該当せず、特定の金融商品の売買を推奨・勧誘するものではありません。',
      bookmarkColor: '#3b82f6'
    },
    {
      title: '投資リスクに関する警告',
      content: '株式投資には価格変動リスク、信用リスク、流動性リスク等が伴い、投資元本を割り込む可能性があります。過去の運用実績は将来の運用成果を保証するものではありません。市場環境の変化により、予想外の損失が発生する可能性があります。',
      bookmarkColor: '#ef4444'
    },
    {
      title: '情報の正確性について',
      content: '提供される情報は、信頼できると判断した情報源から取得していますが、その正確性、完全性、適時性を保証するものではありません。AI分析結果は参考情報として提供されるものであり、絶対的な投資判断基準ではありません。',
      bookmarkColor: '#f59e0b'
    },
    {
      title: '投資判断の責任',
      content: '最終的な投資判断は、利用者ご自身の責任において行ってください。本サービスの利用により生じたいかなる損害についても、当社は一切の責任を負いません。投資を行う際は、証券会社等の金融商品取引業者にご相談ください。',
      bookmarkColor: '#8b5cf6'
    }
  ];

  return (
    <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
      <div className="bg-pale-yellow rounded-xl px-4 sm:px-5 py-3 sm:py-4">
        <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 text-center">
          サービスの性質
        </h2>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {declarations.map((declaration, index) => (
          <div
            key={index}
            className="relative bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-md"
          >
            <div
              className="absolute top-0 left-0 w-1 sm:w-1.5 h-full rounded-l-xl"
              style={{ backgroundColor: declaration.bookmarkColor }}
            ></div>

            <div className="ml-2 sm:ml-3">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <div
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: declaration.bookmarkColor }}
                ></div>
                <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900">
                  {declaration.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {declaration.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
