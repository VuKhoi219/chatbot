import {ExternalLink } from 'lucide-react';

export const SurveyAndFeedback = () => { 
      // Danh sách Google Forms khảo sát
  const surveyForms = [
    {
      id: 1,
      title: 'Khảo sát trải nghiệm người dùng',
      description: 'Đánh giá về giao diện và tính năng của ứng dụng',
      link: 'https://forms.gle/example1',
      category: 'UX/UI'
    },
    {
      id: 2,
      title: 'Feedback về chất lượng dịch vụ',
      description: 'Góp ý cải thiện chất lượng phục vụ khách hàng',
      link: 'https://forms.gle/example2',
      category: 'Dịch vụ'
    },
    {
      id: 3,
      title: 'Khảo sát sở thích âm nhạc',
      description: 'Tìm hiểu thể loại nhạc yêu thích của bạn',
      link: 'https://forms.gle/example3',
      category: 'Giải trí'
    },
    {
      id: 4,
      title: 'Đánh giá tính năng mới',
      description: 'Phản hồi về các tính năng được cập nhật gần đây',
      link: 'https://forms.gle/example4',
      category: 'Sản phẩm'
    },
    {
      id: 5,
      title: 'Khảo sát thị trường',
      description: 'Nghiên cứu xu hướng và nhu cầu người dùng',
      link: 'https://forms.gle/example5',
      category: 'Thị trường'
    },
    {
      id: 6,
      title: 'Feedback hiệu suất ứng dụng',
      description: 'Báo cáo lỗi và đề xuất cải thiện hiệu suất',
      link: 'https://forms.gle/example6',
      category: 'Kỹ thuật'
    },
    {
      id: 7,
      title: 'Khảo sát hành vi người dùng',
      description: 'Phân tích cách sử dụng và tương tác với ứng dụng',
      link: 'https://forms.gle/example7',
      category: 'Phân tích'
    },
    {
      id: 8,
      title: 'Đánh giá nội dung',
      description: 'Góp ý về chất lượng và tính hữu ích của nội dung',
      link: 'https://forms.gle/example8',
      category: 'Nội dung'
    }
  ];
    return (<>
            <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <div className="space-y-3 pb-8">
              {surveyForms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-800 leading-tight">
                      {form.title}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
                      {form.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    {form.description}
                  </p>
                  <button
                    onClick={() => window.open(form.link, '_blank')}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Tham gia khảo sát
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
    </>)
}
